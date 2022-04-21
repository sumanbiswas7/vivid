import { View, Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-community/masked-view";
import IonIcons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";

export function Test() {
  const { colors } = useTheme();
  return (
    <MaskedView
      style={{ height: 25, width: 25, backgroundColor: "transparent" }}
      maskElement={<IonIcons name="checkmark-circle-outline" size={25} />}
    >
      <LinearGradient
        colors={[colors.gradient_1, colors.gradient_2]}
        start={{ x: 0.9, y: 0.2 }}
        style={{ flex: 1, backgroundColor: "transparent" }}
      />
    </MaskedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
