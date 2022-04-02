import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Picker,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { StatusBar as ESB } from "expo-status-bar";
import { useTheme } from "@react-navigation/native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { UserImg } from "../components/Post/UserImg";
import { actionCreators } from "../state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { ImageModal } from "../components/ImageModal";
import AntDesign from "react-native-vector-icons/AntDesign";
import TagInput from "react-native-tags-input";
import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export function EditProfile({ navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const { colors } = useTheme();
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  const [tags, setTags] = useState({
    tag: "",
    tagsArray: currentuser.tags || [],
  });
  const [fullName, setFullName] = useState(currentuser.fullname);
  const [userName, setUserName] = useState(currentuser.username);
  const [city, setCity] = useState(currentuser.city);
  const [bio, setBio] = useState(currentuser.bio);
  const [gender, setGender] = useState(currentuser.gender);
  const [status, setStatus] = useState(currentuser.status);
  const [ig, setIg] = useState(currentuser.ig_link);
  const [git, setGit] = useState(currentuser.git_link);
  const [fb, setFb] = useState(currentuser.fb_link);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState(currentuser.profile);

  function handleChooseImageClick(e) {
    const pickImage = async (mode) => {
      // if (mode == "camera") {
      //   const permissionResult =
      //     await ImagePicker.requestMediaLibraryPermissionsAsync();
      //   if (permissionResult.granted === false) {
      //     setModalVisible(false);
      //     return;
      //   }
      //   const result = await ImagePicker.launchCameraAsync({
      //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //     allowsEditing: true,
      //     aspect: [1, 1],
      //     quality: 0.5,
      //   });
      //   if (!result.cancelled) {
      //     const manipResult = await manipulateAsync(
      //       result.uri,
      //       [{ resize: { width: 500 } }],
      //       {
      //         compress: 0.4,
      //       }
      //     );
      //     setImage(manipResult.uri);
      //   }
      // }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.cancelled) {
        const manipResult = await manipulateAsync(
          result.uri,
          [{ resize: { width: 500 } }],
          {
            compress: 0.4,
          }
        );
        setImage(manipResult.uri);
      }
    };
    if (e == "camera") {
      pickImage("camera");
    } else if (e == "gallery") {
      pickImage("gallery");
    }
  }
  async function handleEditSubmit() {
    setUpdating(true);
    let err = 0;
    tags.tagsArray.forEach((tag) => {
      if (tag.length > 9) {
        ToastAndroid.show(
          "Tags must not exceed 10 characters",
          ToastAndroid.SHORT
        );
        setUpdating(false);
        err = 1;
      }
    });
    if (tags.tagsArray.length > 3) {
      ToastAndroid.show("You can add max 3 tags", ToastAndroid.SHORT);
      setUpdating(false);
      err = 1;
    }
    if (image != currentuser.profile) {
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
      const storageRef = sRef(storage, `users/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          setUpdating(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            submitEdit(downloadURL);
          });
        }
      );
    } else {
      submitEdit(currentuser.profile);
    }

    async function submitEdit(img) {
      if (err != 0) {
        return;
      }
      let newArr;
      if (tags.tagsArray.length > 0 && tags.tagsArray !== currentuser.tags) {
        const arr = [...tags.tagsArray];
        newArr = arr.map((t) => {
          if (!t.startsWith("#")) {
            return "#" + t.toLowerCase();
          } else return t.toLowerCase();
        });
      } else {
        newArr = [...tags.tagsArray];
      }
      const db = getFirestore();
      const userProfileRef = doc(db, "users", currentuser.email);
      await updateDoc(userProfileRef, {
        fullname: fullName || "",
        username: userName || "",
        city: city || "",
        tags: newArr || tags.tagsArray || [],
        gender: gender || "",
        status: status || "",
        bio: bio || "",
        ig_link: ig || "",
        git_link: git || "",
        fb_link: fb || "",
        profile: img || currentuser.profile || "",
      }).then(() => {
        currentuser.posts.forEach((element) => {
          const postRef = doc(db, "posts", element);
          console.log(element);
          updateDoc(postRef, {
            user_data: {
              username: userName || "",
              profile_img: img || currentuser.profile || "",
              city: city || "",
              email: currentuser.email,
              isVerified: currentuser.isVerified,
            },
          });
        });
        setUpdating(false);
        navigation.replace("home");
      });
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.bg_dark }]}>
      <ImageModal handleClick={handleChooseImageClick} />
      <View style={[styles.header, { backgroundColor: colors.bg_light }]}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            disabled={updating}
            onPress={() => navigation.navigate("home")}
          >
            <AntDesign
              name="back"
              color={colors.text}
              size={22}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <Text style={[styles.text, { color: colors.text }]}>
            Edit Profile
          </Text>
        </View>
        <TouchableOpacity disabled={updating} onPress={handleEditSubmit}>
          <MaskedView
            style={{ height: 25, width: 25 }}
            maskElement={<IonIcons name="checkmark-circle-outline" size={25} />}
          >
            <LinearGradient
              colors={[colors.gradient_1, colors.gradient_2]}
              start={{ x: 0.9, y: 0.2 }}
              style={{ flex: 1 }}
            />
          </MaskedView>
        </TouchableOpacity>
      </View>
      {!updating ? (
        <ScrollView
          style={{ marginTop: 50 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={
              () => handleChooseImageClick("gallery")
              // toggleModal({ camera: true, home: false })
            }
            style={{ alignSelf: "center", marginTop: 30 }}
          >
            <UserImg profile_img={image} size={60} />
            <IonIcons
              name="add-circle"
              size={15}
              color={colors.modal}
              style={styles.plus_icon}
            />
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "Comfortaa-Medium",
              marginBottom: 15,
              color: colors.text,
            }}
          >
            profile picture
          </Text>
          <View style={styles.flex}>
            <Text style={[styles.input_title, { color: colors.text }]}>
              full name
            </Text>
            <TextInput
              onChangeText={(t) => setFullName(t)}
              style={styles.input}
              placeholder="your name"
              defaultValue={currentuser.fullname}
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.input_title, { color: colors.text }]}>
              username
            </Text>
            <TextInput
              onChangeText={(t) => {
                setUserName(t.toLowerCase().split(" ").join(""));
              }}
              style={styles.input}
              placeholder="username"
              // defaultValue={currentuser.username}
              color={colors.text}
              value={userName}
              placeholderTextColor={colors.accent}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.input_title, { color: colors.text }]}>
              city
            </Text>
            <TextInput
              onChangeText={(t) => setCity(t)}
              style={styles.input}
              placeholder="city"
              defaultValue={currentuser.city}
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.input_title, { color: colors.text }]}>
              bio
            </Text>
            <TextInput
              onChangeText={(t) => setBio(t)}
              style={styles.input}
              placeholder="bio"
              autoCapitalize="none"
              defaultValue={currentuser.bio}
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
          <View
            style={[
              styles.flex,
              {
                justifyContent: "flex-start",
                marginLeft: 15,
              },
            ]}
          >
            <Text style={[styles.input_title, { color: colors.text }]}>
              hobbies
            </Text>
            <View style={styles.tag_container}>
              <TagInput
                updateState={setTags}
                tags={tags}
                style={{ width: 250, fontFamily: "Comfortaa-Medium" }}
                tagStyle={styles.tag}
                placeholder="add tags (max - 3)"
                placeholderTextColor={colors.text}
                color={colors.text}
              />
            </View>
          </View>
          <View
            style={[
              styles.flex,
              {
                justifyContent: "flex-start",
                marginLeft: 15,
              },
            ]}
          >
            <Text style={[styles.input_title, { color: colors.text }]}>
              gender
            </Text>
            <Picker
              selectedValue={currentuser.gender}
              style={{
                height: 50,
                width: 100,
                color: colors.text,
              }}
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
              }}
            >
              <Picker.Item label="XX" value="she/her" />
              <Picker.Item label="XY" value="he/him" />
            </Picker>
          </View>
          <View
            style={[
              styles.flex,
              {
                justifyContent: "flex-start",
                marginLeft: 15,
              },
            ]}
          >
            <Text style={[styles.input_title, { color: colors.text }]}>
              i am
            </Text>
            <Picker
              selectedValue={currentuser.status || ""}
              style={{
                height: 50,
                width: 150,
                color: colors.text,
              }}
              onValueChange={(itemValue, itemIndex) => {
                setStatus(itemValue);
              }}
            >
              <Picker.Item label="single" value="single" />
              <Picker.Item label="in mingle" value="mingle" />
              <Picker.Item label="none" value="" />
            </Picker>
          </View>
          <View style={styles.flex}>
            <AntDesign
              style={styles.input_title}
              name="instagram"
              size={20}
              color={colors.text}
            />
            <TextInput
              onChangeText={(t) => setIg(t)}
              style={styles.input}
              defaultValue={currentuser.ig_link}
              placeholder="instagram handle"
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
          <View style={styles.flex}>
            <AntDesign
              style={styles.input_title}
              name="facebook-square"
              size={20}
              color={colors.text}
            />
            <TextInput
              onChangeText={(t) => setFb(t)}
              style={styles.input}
              placeholder="facebook handle"
              defaultValue={currentuser.fb_link}
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
          <View style={styles.flex}>
            <AntDesign
              style={styles.input_title}
              name="github"
              size={20}
              color={colors.text}
            />
            <TextInput
              onChangeText={(t) => setGit(t)}
              style={styles.input}
              placeholder="github handle"
              defaultValue={currentuser.git_link}
              color={colors.text}
              placeholderTextColor={colors.accent}
            />
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator color={colors.gradient_1} size={25} />
      )}
      <ESB backgroundColor={colors.bg_light} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
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
    top: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    fontFamily: "Comfortaa-Medium",
  },
  plus_icon: {
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 20,
    justifyContent: "center",
  },
  input_title: {
    fontFamily: "Comfortaa-Medium",
    width: 80,
  },
  input: {
    marginLeft: 10,
    borderBottomColor: "#c4c4c4",
    borderBottomWidth: 1,
    width: 250,
    paddingVertical: 15,
    fontFamily: "Comfortaa-Medium",
  },
  tag_container: {
    borderBottomColor: "#c4c4c4",
    borderBottomWidth: 1,
    width: 250,
    marginLeft: 10,
    paddingVertical: 10,
    fontFamily: "Comfortaa-Medium",
  },
  tag: {
    fontFamily: "Comfortaa-Medium",
    height: 30,
  },
});
