import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import app from "../firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { VividText } from "../components/VividText";
import useFonts from "../hooks/useFonts";
import { CircleLoader } from "../components/CircleLoader";
import { Flow } from "react-native-animated-spinkit";
export default function LogIn({ navigation }) {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [errText, setErrText] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userInput, setUserInput] = useState({});
  const { colors } = useTheme();
  useEffect(() => {
    const LoadFonts = async () => {
      await useFonts();
      setFontLoaded(true);
    };
    LoadFonts();
  }, []);

  async function handleLogin() {
    if (!userInput?.email || !userInput?.password) {
      setErrText("| | | | | are you drunk? ( ͡ಥ ͜ʖ ͡ಥ)");
    } else {
      setButtonLoader(true);
      const auth = getAuth();
      signInWithEmailAndPassword(auth, userInput.email, userInput.password)
        .then((userCredential) => {
          const user = userCredential.user;
          navigation.replace("home");
        })
        .catch((error) => {
          setButtonLoader(false);
          const errorMessage = error.message;
          setErrText(errorMessage);
        });
    }
  }
  return (
    <>
      {fontLoaded ? (
        <View style={[styles.container, { backgroundColor: colors.bg_light }]}>
          <VividText size={50} />
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
            onChangeText={(t) =>
              setUserInput((p) => ({
                ...p,
                email: t.toLowerCase().split(" ").join(""),
              }))
            }
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            secureTextEntry={true}
            style={[
              styles.input,
              { color: colors.text, borderBottomColor: colors.accent },
            ]}
            placeholderTextColor={colors.text}
            onChangeText={(t) => setUserInput((p) => ({ ...p, password: t }))}
            placeholder="password"
          />
          {errText ? (
            <Text style={styles.err_text}>{errText.slice(10)}</Text>
          ) : null}
          <TouchableOpacity
            disabled={buttonLoader}
            style={styles.signup_btn_box}
            onPress={handleLogin}
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
                  LOG IN
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <>
            <Text style={{ color: colors.text }}>
              Don't have an account?
              <Text
                onPress={() => navigation.replace("signup")}
                style={{
                  color: colors.gradient_2,
                }}
              >
                {" "}
                Sign Up{" "}
              </Text>
              here
            </Text>
          </>
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
