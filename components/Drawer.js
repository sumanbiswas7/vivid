import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export function Drawer(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#d23",
    flex: 1,
  },
  header: {},
});
