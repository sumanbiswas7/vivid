import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar as SBAR,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flow } from "react-native-animated-spinkit";
import { Wave } from "react-native-animated-spinkit";
import * as Progress from "react-native-progress";
import * as ImagePicker from "expo-image-picker";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { manipulateAsync } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import BottomNavBar from "../components/BottomNavBar";
import { useTheme } from "@react-navigation/native";
import { ImageModal } from "../components/ImageModal";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import moment from "moment";
import uuid from "react-native-uuid";
import { useState } from "react";
import { UserImg } from "../components/Post/UserImg";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { VerifiedText } from "../components/Post/VerifiedText";
import { StarOutline } from "../components/Post/Star";
import ImageAutoHeight from "react-native-image-auto-height";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import axios from "axios";

export default function CreatePost({ navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const initialLoadContex = useSelector((state) => state.initialLoad);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [nullUpload, setNullUpload] = useState("");
  const { colors } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  async function handlePost() {
    if (!image && !caption) {
      setNullUpload("Hey you can't just upload nothing !");
    } else {
      setNullUpload(null);
      setButtonLoader(true);
      setIsUploading(true);
      if (image) {
        let uri = image;
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });

        const storage = getStorage();
        const storageRef = sRef(storage, `posts/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 1;
            setProgress(progress);
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log("uploading user image failed" + error);
            setButtonLoader(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              postImage(downloadURL);
            });
          }
        );
      } else {
        postImage("");
      }
      function postImage(url) {
        const DB = getFirestore();
        const PostId = uuid.v4();
        const postSchema = {
          id: PostId,
          date: moment(new Date()).format("DD-MM-YYYY, h:mm a"),
          likes: {
            likes: 0,
            total_likes: [],
          },
          comments: [],
          img: url,
          caption: caption,
          timestamp: new Date(),
          user_data: {
            username: currentuser.username,
            email: currentuser.email,
            city: currentuser.city,
            profile_img: currentuser.profile,
            isVerified: currentuser.isVerified,
          },
        };
        setDoc(doc(DB, "posts", PostId), postSchema).then(() => {
          setDoc(doc(DB, "users", currentuser.email), {
            ...currentuser,
            posts: [...currentuser.posts, PostId],
          }).then(() => {
            setButtonLoader(false);
            console.log("POSTED");
            setImage(false);
            setIsUploading(false);
            navigation.replace("home");
          });
        });
      }
    }
  }
  function handleChooseImageClick(e) {
    const pickImage = async (mode) => {
      // if (mode == "camera") {
      //   const permissionResult =
      //     await ImagePicker.requestMediaLibraryPermissionsAsync();
      //   if (permissionResult.granted === false) {
      //     return;
      //   }
      //   const result = await ImagePicker.launchCameraAsync({
      //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //     allowsEditing: true,
      //     quality: 1,
      //   });
      //   if (!result.cancelled) {
      //     const manipResult = await manipulateAsync(
      //       result.uri,
      //       [{ resize: { width: 800 } }],
      //       {
      //         compress: 0.6,
      //       }
      //     );
      //     setImage(manipResult.uri);
      //   }
      // }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const manipResult = await manipulateAsync(
          result.uri,
          [{ resize: { width: 800 } }],
          {
            compress: 0.6,
          }
        );
        const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
          encoding: "base64",
        });
        let base64Img = `data:image/jpg;base64,${base64}`;
        setPreviewImage(manipResult.uri);
        setImage(base64Img);
      }
    };
    if (e == "camera") {
      pickImage("camera");
    } else if (e == "gallery") {
      pickImage("gallery");
    }
  }
  async function uploadPost() {
    setIsUploading(true);
    setButtonLoader(true);
    let data = {
      file: image,
      upload_preset: "nhpvtkem",
    };
    fetch("https://api.cloudinary.com/v1_1/dg4rjg58p/image/upload", {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then((resp) => resp.json())
      .then((data) => {
        postImage(data.url);
        function postImage(url) {
          const DB = getFirestore();
          const PostId = uuid.v4();
          const postSchema = {
            id: PostId,
            date: moment(new Date()).format("DD-MM-YYYY, h:mm a"),
            likes: {
              likes: 0,
              total_likes: [],
            },
            comments: [],
            img: url,
            caption: caption,
            timestamp: new Date(),
            user_data: {
              username: currentuser.username,
              email: currentuser.email,
              city: currentuser.city,
              profile_img: currentuser.profile,
              isVerified: currentuser.isVerified,
            },
          };
          setDoc(doc(DB, "posts", PostId), postSchema).then(() => {
            setDoc(doc(DB, "users", currentuser.email), {
              ...currentuser,
              posts: [...currentuser.posts, PostId],
            }).then(() => {
              setButtonLoader(false);
              console.log("POSTED");
              setImage(false);
              setIsUploading(false);
              navigation.replace("home");
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      {initialLoadContex ? (
        <View style={[styles.container, { backgroundColor: colors.home_bg }]}>
          <View style={[styles.header, { backgroundColor: colors.home_fg }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="back" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.header_text, { color: colors.text }]}>
                Create Post
              </Text>
            </View>
            {/* <Entypo name="dots-three-vertical" size={15} color={colors.text} /> */}
          </View>
          <ImageModal handleClick={handleChooseImageClick} />
          <ScrollView
            style={[
              styles.page_main,
              {
                marginTop: image ? 100 : 220,
                marginBottom: tabBarHeight,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.page_main_box}>
              {isUploading ? (
                <>
                  <Wave
                    style={{ marginBottom: 20, marginTop: 150 }}
                    color={colors.gradient_2}
                  />
                  <Text
                    style={[{ color: colors.gradient_2 }, styles.progress_text]}
                  >
                    Uploading Post
                  </Text>
                </>
              ) : (
                <>
                  <View
                    style={[
                      styles.user_data_box,
                      { backgroundColor: colors.home_fg },
                    ]}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <UserImg
                        profile_img={currentuser.profile}
                        col_1="#cccccc"
                        col_2="#fff"
                      />
                      <View style={styles.name_time_text_container}>
                        <VerifiedText
                          isVerified={currentuser.isVerified}
                          text={currentuser.username}
                          size={14}
                          color={colors.text}
                        />
                        <Text style={[styles.time, { color: colors.text }]}>
                          few seconds ago
                        </Text>
                      </View>
                    </View>
                    <Entypo
                      name="dots-three-vertical"
                      size={15}
                      color={colors.text}
                    />
                  </View>
                  <TextInput
                    onChangeText={(t) => setCaption(t)}
                    style={[
                      styles.caption_input,
                      { backgroundColor: colors.home_fg },
                    ]}
                    placeholder="write something"
                    placeholderTextColor={"#919191"}
                    color={colors.text}
                  />
                  {image ? (
                    <TouchableOpacity
                      onPress={() => handleChooseImageClick("gallery")}
                      // onPress={() => toggleModal({ camera: true, home: false })}
                    >
                      <ImageAutoHeight
                        style={styles.selected_img}
                        source={{ uri: previewImage }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.image_picker_box,
                          { backgroundColor: colors.home_fg },
                        ]}
                        onPress={
                          () => handleChooseImageClick("gallery")
                          // toggleModal({ camera: true, home: false })
                        }
                      >
                        <Entypo
                          name="images"
                          color={"rgba(166, 166, 166, 0.25)"}
                          size={130}
                        />
                        <Text style={[styles.text, { color: "#919191" }]}>
                          pick image
                        </Text>
                        {/* <Ionicons
                        name="add-circle-outline"
                        size={130}
                        color={"rgba(166, 166, 166, 0.25)"}
                      /> */}
                      </TouchableOpacity>
                    </>
                  )}
                  <View
                    style={[styles.footer, { backgroundColor: colors.home_fg }]}
                  >
                    <View style={styles.flex_fix}>
                      <AntDesign name="like2" size={17} color={colors.text} />
                      <Text
                        style={{
                          fontSize: 10,
                          marginTop: 3,
                          marginLeft: 5,
                          color: colors.text,
                        }}
                      >
                        0 Like
                      </Text>
                    </View>
                    <View style={styles.flex_fix}>
                      <MaterialCommunityIcons
                        name="comment-processing-outline"
                        size={18}
                        color={colors.text}
                        style={{ marginTop: 7 }}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          marginTop: 3,
                          marginLeft: 5,
                          color: colors.text,
                        }}
                      >
                        0 Comment
                      </Text>
                    </View>
                    <View style={styles.flex_fix}>
                      <StarOutline color={colors.text} />
                      <StarOutline color={colors.text} />
                      <StarOutline color={colors.text} />
                    </View>
                  </View>
                </>
              )}

              {nullUpload ? (
                <Text style={styles.upload_err_text}>{nullUpload}</Text>
              ) : null}
              {caption || image ? (
                <>
                  {!isUploading ? (
                    <TouchableOpacity
                      disabled={buttonLoader}
                      onPress={uploadPost}
                      style={styles.signup_btn_box}
                    >
                      <LinearGradient
                        start={{ x: 0.9, y: 0.2 }}
                        colors={[colors.gradient_1, colors.gradient_2]}
                        style={styles.signup_btn}
                      >
                        {buttonLoader ? (
                          <Flow size={30} color="#fff" />
                        ) : (
                          <Text style={{ fontWeight: "bold", color: "#fff" }}>
                            POST
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      ) : (
        <ActivityIndicator
          size={25}
          style={[styles.activity, { backgroundColor: colors.home_bg }]}
          color={colors.gradient_2}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    height: Dimensions.get("window").height,
    justifyContent: "center",
  },
  header: {
    width: Dimensions.get("window").width,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    position: "absolute",
    shadowColor: "#000",
    zIndex: 99,
    top: SBAR.currentHeight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  header_text: {
    fontSize: 15,
    fontFamily: "Comfortaa-Medium",
    marginLeft: 10,
  },
  progress_text: {
    fontFamily: "Comfortaa-Light",
    fontSize: 20,
    marginBottom: 20,
  },
  user_data_box: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  user_data_name: {
    color: "#fff",
    fontSize: 23,
    fontFamily: "Comfortaa-Light",
  },
  user_data_city: {
    textTransform: "uppercase",
    fontSize: 10,
    color: "#fff",
  },
  page_main_box: {
    justifyContent: "center",
    alignItems: "center",
  },
  caption_input: {
    width: Dimensions.get("window").width - 20,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: "center",
    textAlign: "left",
    fontFamily: "Comfortaa-Light",
  },
  image_picker_box: {
    width: Dimensions.get("window").width - 20,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 30,
  },
  selected_img: {
    width: 200,
    width: Dimensions.get("window").width - 20,
    height: "auto",
  },
  pick_img_text: {
    color: "#b0b0b0",
    textAlign: "left",
    width: Dimensions.get("window").width - 20,
    marginBottom: 15,
    fontFamily: "Comfortaa-Light",
  },
  upload_err_text: {
    marginBottom: 10,
    marginTop: -10,
    textAlign: "left",
    width: Dimensions.get("window").width - 60,
    color: "#b32323",
  },
  signup_btn_box: {
    // marginBottom: 10,
    marginTop: 10,
  },
  signup_btn: {
    width: Dimensions.get("window").width - 20,
    height: 55,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  verified_icon: {
    marginTop: 7,
    marginLeft: 5,
  },
  activity: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  name_time_text_container: {
    alignItems: "flex-start",
    marginLeft: 5,
  },
  time: {
    fontFamily: "Comfortaa-Light",
    fontSize: 9,
  },
  img_add: {
    position: "absolute",
    right: 70,
    bottom: 40,
  },
  footer: {
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  flex_fix: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Comfortaa-Light",
    marginLeft: 10,
  },
});
