import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";

export function Notifications({ navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);
  async function clearNotification(email) {
    const userRef = doc(getFirestore(), "users", email);
    await updateDoc(userRef, {
      notification: [],
    });
  }
  useEffect(() => {
    clearNotification(currentuser.email);
    // const NOT = currentuser.notification?.sort(function (o1, o2) {
    //   return new Date(o2.date) - new Date(o1.date);
    // });
    // setNotifications(NOT.reverse());
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: colors.home_bg }]}>
      <View style={[styles.header, { backgroundColor: colors.home_fg }]}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign size={22} name="back" color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.text, { color: colors.text }]}>
            Notifications
          </Text>
        </View>
      </View>
      <FlatList
        style={styles.list}
        data={currentuser.notification}
        renderItem={({ item }) => {
          return (
            <View style={styles.not_container}>
              {item.type == "like" ? (
                <Text style={[styles.not_text, { color: colors.text }]}>
                  {item.by} has {item.type}d your post
                </Text>
              ) : (
                <Text style={[styles.not_text, { color: colors.text }]}>
                  {item.by} has {item.type}ed &quot;{item.comment}&quot; on your
                  post
                </Text>
              )}
              <Image source={{ uri: item.img }} style={styles.not_img} />
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: Dimensions.get("window").width,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    position: "absolute",
    top: StatusBar.currentHeight,
  },
  text: {
    fontSize: 15,
    fontFamily: "Comfortaa-Medium",
    marginLeft: 10,
  },
  list: {
    marginTop: StatusBar.currentHeight + 60,
  },
  not_container: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  not_text: {
    fontFamily: "Comfortaa-Medium",
    width: Dimensions.get("window").width - 100,
  },
  not_img: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
