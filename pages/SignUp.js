import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Linking,
} from "react-native";
import { ImageModal } from "../components/ImageModal";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { LinearGradient } from "expo-linear-gradient";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useState, useEffect } from "react";
import { Circle, Flow } from "react-native-animated-spinkit";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import moment from "moment";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import useFonts from "../hooks/useFonts";
import { CircleLoader } from "../components/CircleLoader";
export default function SignUp({ navigation }) {
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  const [buttonLoader, setButtonLoader] = useState(false);
  const [errText, setErrText] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [image, setImage] = useState("");
  const [userInput, setUserInput] = useState({ username: "" });
  const { colors } = useTheme();
  useEffect(() => {
    const LoadFonts = async () => {
      await useFonts();
      setFontLoaded(true);
    };
    LoadFonts();
  }, []);

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
  async function handleSignUp() {
    console.log(userInput);
    if (
      !userInput?.fullname ||
      !userInput?.username ||
      !userInput?.email ||
      !userInput?.city ||
      !userInput?.password
    ) {
      setErrText("! ! ! ! ! Everything is required dear :) ");
    } else {
      setButtonLoader(true);
      setErrText("");
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
            setButtonLoader(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              signUpAndSaveUser(downloadURL);
            });
          }
        );
      } else {
        signUpAndSaveUser("", userInput.email, userInput.password);
      }
      function signUpAndSaveUser(imgurl) {
        const DB = getFirestore();
        try {
          const auth = getAuth();
          const userSchema = {
            ...userInput,
            created_at: moment(new Date()).format("DD-MM-YYYY, h:mm a"),
            profile: imgurl,
            isVerified: false,
            posts: [],
          };
          createUserWithEmailAndPassword(
            auth,
            userInput.email,
            userInput.password
          )
            .then(() => {
              setDoc(doc(DB, "users", userInput.email), userSchema)
                .then(() => {
                  console.log("creating user : successfull");
                  setButtonLoader(false);
                  navigation.replace("home");
                })
                .catch((err) =>
                  console.log("SignUp -> CREATING USER ERR" + err)
                );
            })
            .catch((error) => {
              setErrText(error.message);
              console.log(error);
              setButtonLoader(false);
            });
        } catch {
          (err) => console.log("SignUp -> REG ERR " + err);
        }
      }
    }
  }
  return (
    <>
      {fontLoaded ? (
        <View style={[styles.container, { backgroundColor: colors.bg_light }]}>
          <ImageModal handleClick={handleChooseImageClick} />
          {/* Image Choosing Box */}
          <TouchableOpacity
            onPress={
              () => handleChooseImageClick("gallery")
              // toggleModal({ camera: true, home: false })
            }
            style={styles.selected_img_box}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!image ? (
                <LinearGradient
                  start={{ x: 0.9, y: 0.2 }}
                  colors={[colors.gradient_1, colors.gradient_2]}
                  style={styles.select_img_gradient}
                >
                  <EvilIcons name="camera" size={50} color="#000" />
                </LinearGradient>
              ) : (
                <Image
                  style={styles.select_img_gradient}
                  source={{ uri: image }}
                />
              )}
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: "Comfortaa-Light",
                  color: "#9e9e9e",
                }}
              >
                choose your profile picture
              </Text>
            </View>
          </TouchableOpacity>
          <TextInput
            onChangeText={(t) => setUserInput((p) => ({ ...p, fullname: t }))}
            placeholder="full-name"
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
          />
          <TextInput
            onChangeText={(t) =>
              setUserInput((p) => ({
                ...p,
                username: t.toLowerCase().split(" ").join(""),
              }))
            }
            value={userInput.username}
            placeholder="username"
            autoCapitalize="none"
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
          />
          <TextInput
            onChangeText={(t) => setUserInput((p) => ({ ...p, city: t }))}
            style={[
              styles.input,
              styles.city_input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
            placeholder="city"
          />
          <TextInput
            onChangeText={(t) =>
              setUserInput((p) => ({
                ...p,
                email: t.toLowerCase().split(" ").join(""),
              }))
            }
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
          />
          <TextInput
            secureTextEntry={true}
            onChangeText={(t) => setUserInput((p) => ({ ...p, password: t }))}
            placeholder="create password"
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
          />
          {errText ? (
            <Text style={styles.err_text}>{errText.slice(10)}</Text>
          ) : null}

          <TouchableOpacity
            disabled={buttonLoader}
            style={styles.signup_btn_box}
            onPress={handleSignUp}
          >
            <LinearGradient
              start={{ x: 0.9, y: 0.2 }}
              colors={[colors.gradient_1, colors.gradient_2]}
              style={styles.signup_btn}
            >
              {buttonLoader ? (
                <Flow size={30} color="#fff"></Flow>
              ) : (
                <Text style={{ fontWeight: "bold", color: "#fff" }}>
                  SIGN UP
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <>
            <Text style={{ color: colors.text }}>
              Already have an account?
              <Text
                onPress={() => navigation.navigate("login")}
                style={{
                  color: colors.gradient_2,
                }}
              >
                {" "}
                Log In{" "}
              </Text>
              here
            </Text>
          </>
          <Text
            style={{
              marginHorizontal: 20,
              position: "absolute",
              bottom: 40,
              color: colors.text,
            }}
          >
            By clicking "Sign Up" I accept that I have read and accepted the
            &nbsp;
            <Text
              onPress={() =>
                Linking.openURL(
                  "https://sumanbiswas.vercel.app/apps/privacy-policy/vivid"
                )
              }
              style={{ color: colors.gradient_2 }}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      ) : (
        <CircleLoader />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontFamily: "Comfortaa-Light",
    fontSize: 17,
    width: Dimensions.get("window").width - 30,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 50,
  },
  err_text: {
    marginTop: 5,
    textAlign: "left",
    width: Dimensions.get("window").width - 30,
    color: "#b32323",
  },
  select_img_gradient: {
    borderWidth: 2,
    borderColor: "#fff",
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  signup_btn: {
    width: Dimensions.get("window").width - 30,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});
