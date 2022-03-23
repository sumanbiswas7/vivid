import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar as SB,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Like } from "../components/Like";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";

export function Likes({ route, navigation }) {
  const { liked_by } = route.params;
  const handleOnLoad = (e) => {};
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.home_bg }]}>
      <View style={[styles.header, { backgroundColor: colors.home_fg }]}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign size={22} name="back" color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.text, { color: colors.text }]}>Likes</Text>
        </View>
      </View>
      <FlatList
        data={liked_by}
        renderItem={({ item }) => {
          return (
            <Like
              liked_by={item}
              onLoad={handleOnLoad}
              navigation={navigation}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: SB.currentHeight,
  },
  header: {
    width: Dimensions.get("window").width,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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
  like_box: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    paddingBottom: 8,
    borderRadius: 30,
    backgroundColor: "#242424",
  },
  like: {},
});
