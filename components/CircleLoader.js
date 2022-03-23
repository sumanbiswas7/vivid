import { Circle } from "react-native-animated-spinkit";
import { StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";

export function CircleLoader() {
  const { colors } = useTheme();
  return (
    <Circle
      style={[styles.loader, { backgroundColor: colors.home_bg }]}
      size={20}
      color={colors.modal}
    ></Circle>
  );
}

const styles = StyleSheet.create({
  loader: {
    // marginTop: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
