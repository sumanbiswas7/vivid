import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { UserImg } from "./Post/UserImg";
import moment from "moment";
import { VerifiedText } from "../components/Post/VerifiedText";

export function Comment({ comment_data, navigation }) {
  const [user, setUser] = useState();
  const [load, setLoad] = useState();
  const { colors } = useTheme();
  useEffect(() => {
    getUser();
    async function getUser() {
      const db = getFirestore();
      const docRef = doc(db, "users", comment_data.by);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setLoad(true);
      } else {
        console.log("Comment -> No such User!");
      }
    }
  }, []);

  return (
    <>
      {load ? (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("otherprofile", { email: user.email })
            }
            style={styles.comment_header}
          >
            <UserImg profile_img={user.profile} />
            <View style={{ marginLeft: 5, alignItems: "flex-start" }}>
              <VerifiedText
                text={user.username}
                isVerified={user.isVerified}
                color={colors.text}
              />
              <Text style={[styles.time, { color: colors.text }]}>
                {moment(comment_data.time, "DD-MM-YYYY, h:mm a").fromNow()}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.comment_text}>{comment_data.text}</Text>
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
    width: Dimensions.get("window").width - 20,
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
  },
  circle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 200,
    justifyContent: "flex-start",
    marginTop: 150,
  },
  comment_header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontFamily: "Comfortaa-Medium",
    marginLeft: 5,
  },
  time: {
    fontSize: 11,
  },
  comment_text: {
    backgroundColor: "#fff",
    marginLeft: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
