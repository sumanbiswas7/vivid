import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "@react-navigation/native";

const BottomNavBar = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg_light }]}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <MaterialCommunityIcons name="home-outline" color={"#000"} size={28} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("createpost")}>
        <LinearGradient
          start={{ x: 0.9, y: 0.2 }}
          colors={[colors.gradient_1, colors.gradient_2]}
          style={styles.plus_nav_gradient}
        >
          <Feather name="plus" color={"#fff"} size={22} />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("profile")}>
        <Feather name="user" color={"#000"} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: 55,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(166, 166, 166, 0.5)",
    backgroundColor: "#fff",
  },
  image: {
    marginTop: 20,
    width: 130,
    height: "auto",
  },
  loader: {
    marginTop: 20,
  },
  plus_nav_gradient: {
    width: 60,
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default BottomNavBar;
