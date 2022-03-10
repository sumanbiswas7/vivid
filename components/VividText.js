import { Dimensions, StyleSheet, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";
export function VividText(props) {
  const { colors } = useTheme();
  return (
    <View>
      <MaskedView
        style={styles.mask}
        maskElement={
          <Text style={[{ fontSize: props.size }, styles.text]}>vivid</Text>
        }
      >
        <LinearGradient
          colors={[colors.gradient_1, colors.gradient_2]}
          start={{ x: 0.9, y: 0.2 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );
}
const styles = StyleSheet.create({
  mask: {
    height: 50,
    width: 110,
  },
  text: {
    textAlign: "center",
    fontFamily: "CabinSketch-Regular",
  },
});
