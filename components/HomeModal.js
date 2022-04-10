import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Linking,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { actionCreators } from "../state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { UserImg } from "../components/Post/UserImg";
import { VerifiedText } from "../components/Post/VerifiedText";
import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export function HomeModal({ navigation }) {
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  const modalVisible = useSelector((state) => state.modal);
  const currentuser = useSelector((state) => state.currentuser);
  const [logoutModal, setLogoutModal] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        toggleModal({ camera: false, home: false });
        navigation.replace("login");
      }
    });
  }, [handleSignOut]);
  function handleSignOut() {
    signOut(getAuth());
  }
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={logoutModal}>
        <View style={styles.logout_modal}>
          <View style={styles.logout_modal_view}>
            <Text
              style={{ marginTop: 30, fontSize: 18, paddingHorizontal: 10 }}
            >
              Are you sure you want to logout ?
            </Text>
            <View style={styles.logout_modal_footer}>
              <TouchableOpacity
                onPress={() => setLogoutModal(false)}
                style={{ marginRight: 20 }}
              >
                <Text style={{ textTransform: "uppercase", fontSize: 15 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={{ textTransform: "uppercase", fontSize: 15 }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible.home}
      >
        <View style={styles.modal_view}>
          <View style={[styles.modal, { backgroundColor: colors.home_fg }]}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => toggleModal({ camera: false, home: false })}
            >
              <AntDesign
                style={{ marginRight: 15 }}
                name="closecircleo"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
            <View
              style={[styles.header_view, { borderBottomColor: colors.accent }]}
            >
              <UserImg size={55} profile_img={currentuser.profile} />
              <VerifiedText
                isVerified={currentuser.isVerified}
                text={currentuser.username}
                size={22}
                color={colors.text}
              />
              <Text style={[styles.user_city, { color: colors.text }]}>
                {currentuser.city}
              </Text>
            </View>
            <View style={styles.main}>
              <TouchableOpacity
                onPress={() => {
                  toggleModal({ camera: false, home: false });
                  navigation.navigate("editprofile");
                }}
                style={styles.link_container}
              >
                <Feather name="edit" color={colors.text} size={15} />
                <Text style={[styles.link_text, { color: colors.text }]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleModal({ camera: false, home: false });
                  navigation.navigate("themes");
                }}
                style={styles.link_container}
              >
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  color={colors.text}
                  size={17}
                />
                <Text style={[styles.link_text, { color: colors.text }]}>
                  Themes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleModal({ camera: false, home: false });
                  setLogoutModal(true);
                }}
                style={styles.link_container}
              >
                <SimpleLineIcons name="logout" color={colors.text} size={15} />
                <Text style={[styles.link_text, { color: colors.text }]}>
                  Logout
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://sumanbiswas.vercel.app/contact")
                }
                style={styles.link_container}
              >
                <AntDesign name="message1" color={colors.text} size={15} />
                <Text
                  style={[
                    styles.link_text,
                    { marginTop: -3, color: colors.text },
                  ]}
                >
                  Contact Me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://sumanbiswas.vercel.app/contact")
                }
                style={styles.link_container}
              >
                <Ionicons name="bug-outline" color={colors.text} size={18} />
                <Text style={[styles.link_text, { color: colors.text }]}>
                  Report a bug
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://sumanbiswas.vercel.app/")
                }
                style={styles.link_container}
              >
                <Foundation name="web" color={colors.text} size={19} />
                <Text style={[styles.link_text, { color: colors.text }]}>
                  My website
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text style={[styles.copyright, { color: colors.text }]}>
                Version 2.3.5
              </Text>
              <Text style={[styles.copyright, { color: colors.text }]}>
                &copy; Copyright 2022, Suman Biswas
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modal_view: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modal: {
    backgroundColor: "#f0f0f0",
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: Dimensions.get("window").height,
    width: 300,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "flex-end",
  },
  header_view: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40,
    paddingBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    marginBottom: 20,
  },
  user_city: {
    fontFamily: "Comfortaa-Light",
    textTransform: "uppercase",
    fontSize: 11,
  },
  main: {
    justifyContent: "center",
    // alignItems: "center",
  },
  link_container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  link_text: {
    marginLeft: 8,
    color: "#404040",
    fontSize: 15,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    // backgroundColor: "#d2d",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  copyright: {
    marginVertical: 5,
    fontSize: 10,
    color: "#5e5e5e",
  },
  // LOGOUT MODAL
  logout_modal: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "rgba(0, 0, 0, .2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logout_modal_view: {
    width: 300,
    height: 150,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logout_modal_footer: {
    marginBottom: 20,
    marginRight: 30,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
});
