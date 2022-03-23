import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";

export function ThemeButton({ theme, name, changeTheme }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.btn_container}
      onPress={() => changeTheme()}
    >
      <LinearGradient
        colors={[theme.colors.gradient_1, theme.colors.gradient_2]}
        start={{ x: 0.9, y: 0.2 }}
        style={styles.btn_box}
      />
      <Text style={[styles.btn_text, { color: colors.text }]}>{name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_container: {
    alignItems: "center",
    width: 80,
  },
  btn_box: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
  btn_text: {
    fontFamily: "Comfortaa-Medium",
  },
});
