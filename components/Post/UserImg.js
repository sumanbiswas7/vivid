import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

export function UserImg(props) {
  const { colors } = useTheme();
  return (
    <View>
      {props.profile_img ? (
        <Image
          source={{
            uri: props.profile_img,
          }}
          style={[
            styles.image,
            { width: props.size || 40, height: props.size || 40 },
          ]}
        />
      ) : (
        <LinearGradient
          start={{ x: 0.9, y: 0.2 }}
          colors={[
            props.col_1 || colors.gradient_1,
            props.col_2 || colors.gradient_2,
          ]}
          style={[
            styles.image,
            { width: props.size || 40, height: props.size || 40 },
          ]}
        >
          <Feather
            color={"#1c1c1c"}
            size={props.size * 0.5 || 20}
            name="user"
          />
        </LinearGradient>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 43,
    height: 43,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
