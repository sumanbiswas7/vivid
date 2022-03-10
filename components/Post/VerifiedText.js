import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export function VerifiedText(props) {
  return (
    <>
      {props.isVerified ? (
        <View style={styles.container}>
          <Text
            style={[
              styles.text,
              {
                fontSize: props.size,
                marginLeft: props.marleft || 0,
                color: props.color || "#000",
              },
            ]}
          >
            {props.text}
          </Text>
          <MaterialIcons
            style={[
              styles.verified_icon,
              {
                marginTop: props.size / 3 || 3,
              },
            ]}
            size={props.size / 1.3 || 12}
            color="#FF5F6D"
            name="verified"
          />
        </View>
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: props.size,
              color: props.color || "#000",
            },
          ]}
        >
          {props.text}
        </Text>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f4f4",
  },
  text: {
    fontFamily: "Comfortaa-Medium",
  },
  verified_icon: {
    marginLeft: 3,
  },
});
