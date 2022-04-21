import { StyleSheet, View, Text, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

export function Notification(props) {
  return (
    <View style={styles.container}>
      <Ionicons name="ios-notifications-outline" size={25} />
      {props.notification_count ? (
        <View style={styles.count_box}>
          <Text style={styles.count}>{props.notification_count}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c9c9c9",
    height: 35,
    width: 35,
    marginHorizontal: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  count_box: {
    backgroundColor: "#ff6666",
    width: 15,
    height: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
    position: "absolute",
    top: -2,
    right: -5,
  },
  count: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
