import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar as SB,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Comment } from "../components/Comment";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";

export function Comments({ route, navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const { comments, userId, postImg, postId } = route.params;
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { colors } = useTheme();

  const setNotification = async (user, type) => {
    if (type == "comment" && currentuser.email != userId) {
      const docRef = doc(getFirestore(), "users", user);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data.notification) {
        for (let i = 0; i < data.notification.length; i++) {
          if (data.notification[i].by == userId) {
            console.log(data.notification[i]);
            return;
          }
        }
        const newNotArr = [
          ...docSnap.data().notification,
          {
            type: "comment",
            by: currentuser.username,
            img: postImg,
            comment: input,
          },
        ];
        await updateDoc(docRef, {
          notification: newNotArr,
        });
      } else {
        const newNotArr = [
          {
            type: "comment",
            by: currentuser.username,
            img: postImg,
            comment: input,
          },
        ];
        await updateDoc(docRef, {
          notification: newNotArr,
        });
      }
    }
  };
  const handleCommentSubmit = async (e) => {
    if (input.length >= 1) {
      setIsSending(true);
      const db = getFirestore();
      const commentRef = doc(db, "posts", postId);
      await updateDoc(commentRef, {
        comments: [
          ...comments,
          {
            by: currentuser.email,
            text: input,
            time: moment(new Date()).format("DD-MM-YYYY, h:mm a"),
          },
        ],
      }).then(() => {
        setIsSending(false);
        setNotification(userId, "comment");
        setInput("");
        ToastAndroid.show("Comment posted", ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.replace("home");
        }, 200);
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.home_bg }]}>
      <View style={[styles.header, { backgroundColor: colors.home_fg }]}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign size={22} name="back" color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.text, { color: colors.text }]}>Comments</Text>
        </View>
      </View>
      <View style={[styles.main, { backgroundColor: colors.home_bg }]}>
        <FlatList
          data={comments}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <Comment comment_data={item} navigation={navigation} />;
          }}
        />
      </View>

      <View style={styles.send_container}>
        <TextInput
          value={input}
          onChangeText={(t) => setInput(t)}
          autoFocus
          style={[styles.input, { backgroundColor: colors.home_fg }]}
        ></TextInput>
        <LinearGradient
          start={{ x: 0.9, y: 0.2 }}
          colors={[colors.gradient_1, colors.gradient_2]}
          style={styles.gradient}
        >
          <TouchableOpacity
            disabled={isSending}
            onPress={handleCommentSubmit}
            style={styles.send}
          >
            {isSending ? (
              <ActivityIndicator color={"#FFF"} />
            ) : (
              <MaterialCommunityIcons name="send" size={30} color={"#fafafa"} />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    marginTop: SB.currentHeight,
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
    fontSize: 15,
    fontFamily: "Comfortaa-Medium",
    marginLeft: 10,
  },
  send_container: {
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: "100%",
    width: "85%",
  },
  send: {
    height: "100%",
    width: "15%",
    // backgroundColor: "#545454",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
  main: {
    marginBottom: 75,
    marginTop: 65,
    // backgroundColor: "#d2d",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
