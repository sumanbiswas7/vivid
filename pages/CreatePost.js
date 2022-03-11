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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Flow } from "react-native-animated-spinkit";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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

export default function CreatePost({ navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const initialLoadContex = useSelector((state) => state.initialLoad);
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  const [buttonLoader, setButtonLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [nullUpload, setNullUpload] = useState("");
  const { colors } = useTheme();

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
      if (mode == "camera") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
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
          setImage(manipResult.uri);
        }
      } else {
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
          setImage(manipResult.uri);
        }
      }
    };
    if (e == "camera") {
      pickImage("camera");
    } else if (e == "gallery") {
      pickImage("gallery");
    }
  }
  return (
    <>
      {initialLoadContex ? (
        <View style={styles.container}>
          <ImageModal handleClick={handleChooseImageClick} />
          <LinearGradient
            start={{ x: 0.1, y: 0.1 }}
            colors={[colors.gradient_2, colors.gradient_1]}
            style={styles.page_header_box}
          >
            <View style={styles.user_data_box}>
              <UserImg
                profile_img={currentuser.profile}
                size={50}
                col_1="#cccccc"
                col_2="#fff"
              />
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.user_data_name}>
                    {currentuser.username}
                  </Text>
                  {currentuser.isVerified ? (
                    <MaterialIcons
                      style={styles.verified_icon}
                      size={14}
                      color="#FF5F6D"
                      name="verified"
                    />
                  ) : null}
                </View>
                <Text style={styles.user_data_city}>{currentuser.city}</Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.page_main_box}>
            {isUploading ? (
              <>
                <Progress.Pie
                  style={{ marginBottom: 20 }}
                  color={colors.gradient_2}
                  progress={progress}
                  size={150}
                />
                <Text
                  style={[{ color: colors.gradient_2 }, styles.progress_text]}
                >
                  Uploading - {progress * 100}%
                </Text>
              </>
            ) : (
              <>
                <TextInput
                  onChangeText={(t) => setCaption(t)}
                  style={styles.caption_input}
                  placeholder="write something"
                />
                {image ? (
                  <TouchableOpacity
                    onPress={() => toggleModal({ camera: true, home: false })}
                  >
                    <Image
                      style={styles.selected_img}
                      source={{ uri: image }}
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text style={styles.pick_img_text}>Pick Image</Text>
                    <TouchableOpacity
                      style={styles.image_picker_box}
                      onPress={() => toggleModal({ camera: true, home: false })}
                    >
                      <MaterialIcons
                        name="add-a-photo"
                        color={"rgba(166, 166, 166, 0.25)"}
                        size={120}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {nullUpload ? (
              <Text style={styles.upload_err_text}>{nullUpload}</Text>
            ) : null}

            <TouchableOpacity
              disabled={buttonLoader}
              onPress={handlePost}
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
          </View>
        </View>
      ) : (
        <ActivityIndicator
          size={25}
          style={styles.activity}
          color={colors.gradient_2}
        />
      )}

      <StatusBar style="auto" backgroundColor={colors.bg_light} />
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
  page_header_box: {
    width: Dimensions.get("window").width,
    height: 220,
    justifyContent: "flex-end",
  },
  progress_text: {
    fontFamily: "Comfortaa-Light",
    fontSize: 20,
    marginBottom: 20,
  },
  user_data_box: {
    paddingVertical: 20,
    paddingLeft: 30,
    flexDirection: "row",
    alignItems: "center",
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 220,
    justifyContent: "center",
    alignItems: "center",
  },
  caption_input: {
    width: Dimensions.get("window").width - 60,
    paddingBottom: 15,
    fontSize: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#7C7C7C",
    textAlign: "center",
    textAlign: "left",
    fontFamily: "Comfortaa-Light",
  },
  image_picker_box: {
    borderWidth: 1,
    borderColor: "#7C7C7C",
    width: Dimensions.get("window").width - 60,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selected_img: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
  },
  pick_img_text: {
    color: "#b0b0b0",
    textAlign: "left",
    width: Dimensions.get("window").width - 60,
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
    marginBottom: 10,
    borderRadius: 8,
  },
  signup_btn: {
    width: Dimensions.get("window").width - 60,
    height: 60,
    borderRadius: 8,
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
});
