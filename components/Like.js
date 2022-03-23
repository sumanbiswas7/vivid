import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CircleLoader } from "./CircleLoader";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { UserImg } from "./Post/UserImg";
import { useTheme } from "@react-navigation/native";
import { VerifiedText } from "./Post/VerifiedText";

export function Like({ liked_by, onLoad, navigation }) {
  const { colors } = useTheme();
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState();
  useEffect(() => {
    async function getUser() {
      const db = getFirestore();
      const docRef = doc(db, "users", liked_by);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setLoad(true);
        onLoad(true);
      } else {
        console.log("User -> No such User!");
      }
    }
    getUser();
  }, []);
  return (
    <>
      {load ? (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("otherprofile", { email: user.email })
            }
          >
            <UserImg profile_img={user.profile} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("otherprofile", { email: user.email })
            }
          >
            <VerifiedText
              style={[styles.username, { color: colors.text }]}
              text={user.username}
              isVerified={user.isVerified}
              marleft={10}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator
          style={styles.circle}
          color={colors.gradient_1}
          size={20}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: Dimensions.get("window").width,
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  username: {
    fontFamily: "Comfortaa-Medium",
    marginLeft: 10,
  },
  circle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 200,
    justifyContent: "flex-start",
    marginTop: 150,
  },
});
