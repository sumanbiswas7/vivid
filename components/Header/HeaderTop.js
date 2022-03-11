import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StatusBar as SB } from "react-native";
import { VividText } from "../VividText";
import { Notification } from "./Notification";
import { UserImg } from "../Post/UserImg";
import { HomeModal } from "../HomeModal";
import { actionCreators } from "../../state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
export function HeaderTop({ navigation }) {
  const currentuser = useSelector((state) => state.currentuser);
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  return (
    <>
      <HomeModal navigation={navigation} />
      <View style={styles.container}>
        <View style={{ marginTop: 15 }}>
          <VividText size={32} />
        </View>
        <View style={styles.notification_img_container}>
          <TouchableOpacity
            onPress={() => navigation.navigate("notifications")}
          >
            <Notification
              notification_count={currentuser.notification?.length}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleModal({ camera: false, home: true })}
          >
            <UserImg size={35} profile_img={currentuser.profile} />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" backgroundColor="#fff" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(166, 166, 166, 0.5)",
    height: 55,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: SB.currentHeight,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notification_img_container: {
    flexDirection: "row",
    marginRight: 15,
  },
});
