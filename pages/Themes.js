import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../App";
import { useContext, useState } from "react";
import {
  theme0,
  theme1,
  theme2,
  theme3,
  theme4,
  theme5,
  theme6,
  theme7,
  dark1,
  dark2,
  dark3,
  dark4,
  dark5,
  dark6,
  dark7,
  dark8,
} from "../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { ThemeButton } from "../components/ThemeButton";
import { StatusBar as EBAR } from "expo-status-bar";

export function Themes({ navigation }) {
  const { setTheme } = useContext(ThemeContext);
  const [themeName, setThemeName] = useState();
  function changeTheme(theme, name) {
    setTheme(name);
    setThemeName(theme);
  }
  function saveThemeChanges() {
    AsyncStorage.setItem("theme", themeName).then(() => {
      navigation.goBack();
    });
  }
  const { colors, type } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg_light }]}>
      <View style={[styles.header, { backgroundColor: colors.bg_dark }]}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign size={22} name="back" color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.text, { color: colors.text }]}>Themes</Text>
        </View>
      </View>
      <Text style={[styles.text_theme, { color: colors.text, marginTop: 50 }]}>
        Light Themes
      </Text>
      <View style={styles.row}>
        <ThemeButton
          theme={theme0}
          name="default"
          changeTheme={() => changeTheme("theme0", theme0)}
        />
        <ThemeButton
          theme={theme1}
          name="mojito"
          changeTheme={() => changeTheme("theme1", theme1)}
        />
        <ThemeButton
          theme={theme2}
          name="sublime"
          changeTheme={() => changeTheme("theme2", theme2)}
        />
        <ThemeButton
          theme={theme3}
          name="lush"
          changeTheme={() => changeTheme("theme3", theme3)}
        />
      </View>
      <View style={styles.row}>
        <ThemeButton
          theme={theme4}
          name="navy"
          changeTheme={() => changeTheme("theme4", theme4)}
        />
        <ThemeButton
          theme={theme5}
          name="dolphin"
          changeTheme={() => changeTheme("theme5", theme5)}
        />
        <ThemeButton
          theme={theme6}
          name="grey"
          changeTheme={() => changeTheme("theme6", theme6)}
        />
        <ThemeButton
          theme={theme7}
          name="red"
          changeTheme={() => changeTheme("theme7", theme7)}
        />
      </View>
      <Text style={[styles.text_theme, { color: colors.text }]}>
        Dark Themes
      </Text>
      <View style={styles.row}>
        <ThemeButton
          theme={dark1}
          name="valentine"
          changeTheme={() => changeTheme("dark1", dark1)}
        />
        <ThemeButton
          theme={dark3}
          name="jungle"
          changeTheme={() => changeTheme("dark3", dark3)}
        />
        <ThemeButton
          theme={dark4}
          name="yellow"
          changeTheme={() => changeTheme("dark4", dark4)}
        />
        <ThemeButton
          theme={dark2}
          name="voldemort"
          changeTheme={() => changeTheme("dark2", dark2)}
        />
      </View>
      <View style={styles.row}>
        <ThemeButton
          theme={dark5}
          name="single"
          changeTheme={() => changeTheme("dark5", dark5)}
        />
        <ThemeButton
          theme={dark6}
          name="tomato"
          changeTheme={() => changeTheme("dark6", dark6)}
        />
        <ThemeButton
          theme={dark7}
          name="teal dive"
          changeTheme={() => changeTheme("dark7", dark7)}
        />
        <ThemeButton
          theme={dark8}
          name="kyoo tah"
          changeTheme={() => changeTheme("dark8", dark8)}
        />
      </View>
      <TouchableOpacity onPress={saveThemeChanges}>
        <LinearGradient
          start={{ x: 0.9, y: 0.2 }}
          colors={[colors.gradient_1, colors.gradient_2]}
          style={styles.signup_btn}
        >
          <Text style={{ fontWeight: "bold", color: "#fff" }}>DONE</Text>
        </LinearGradient>
      </TouchableOpacity>
      {type == "dark" ? (
        <EBAR style="light" backgroundColor={colors.bg_dark} />
      ) : (
        <EBAR style="dark" backgroundColor={colors.bg_dark} />
      )}
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
    position: "absolute",
    top: StatusBar.currentHeight,
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
  row: {
    width: Dimensions.get("window").width - 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  signup_btn: {
    width: Dimensions.get("window").width - 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  text_theme: {
    fontFamily: "Comfortaa-Medium",
    marginVertical: 20,
  },
});
