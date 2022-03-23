import { View, Text, StyleSheet, Dimensions } from "react-native";
import ImageAutoHeight from "react-native-image-auto-height";
import { UserImg } from "./Post/UserImg";
import { VerifiedText } from "./Post/VerifiedText";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";

export function ProfilePost({
  img,
  userProfile,
  likes,
  userName,
  date,
  caption,
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {img ? (
        <>
          <View style={[styles.header, { backgroundColor: colors.bg_light }]}>
            <View style={styles.profile_name_container}>
              <UserImg profile_img={userProfile} />
              <View style={styles.name_time_text_container}>
                <VerifiedText
                  isVerified={false}
                  text={userName}
                  size={14}
                  color={colors.text}
                />
                <Text style={[styles.time, { color: colors.text }]}>
                  {date}
                </Text>
              </View>
            </View>
          </View>
          <ImageAutoHeight
            style={styles.post_img}
            source={{ uri: img }}
          ></ImageAutoHeight>
          <LinearGradient
            style={styles.footer}
            colors={["transparent", "rgba(0,0,0,0.5)"]}
          >
            <AntDesign name="like1" color={"#fff"} size={15} />
            <Text style={[styles.like_text, { color: "#fff" }]}>{likes}</Text>
          </LinearGradient>
        </>
      ) : (
        <View>
          <View style={[styles.header, { backgroundColor: colors.bg_light }]}>
            <View style={styles.profile_name_container}>
              <UserImg profile_img={userProfile} />
              <View style={styles.name_time_text_container}>
                <VerifiedText
                  isVerified={false}
                  text={userName}
                  size={14}
                  color={colors.text}
                />
                <Text style={[styles.time, { color: colors.text }]}>
                  {date}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={[
              styles.caption,
              { backgroundColor: colors.bg_light, color: colors.text },
            ]}
          >
            {caption}
          </Text>
          <View style={[styles.footer_2, { backgroundColor: colors.bg_light }]}>
            <AntDesign name="like1" color={colors.text} size={15} />
            <Text style={[styles.like_text, { color: colors.text }]}>
              {likes}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: 5,
  },
  header: {
    width: Dimensions.get("window").width - 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  profile_name_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  name_time_text_container: {
    alignItems: "flex-start",
    marginLeft: 5,
  },
  time: {
    fontFamily: "Comfortaa-Light",
    fontSize: 9,
    color: "#000",
  },
  post_img: {
    width: Dimensions.get("window").width - 20,
    height: "auto",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  footer: {
    width: Dimensions.get("window").width - 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  like_text: {
    color: "#fff",
    fontFamily: "Comfortaa-Medium",
    marginLeft: 5,
    fontSize: 10,
  },
  footer_2: {
    width: Dimensions.get("window").width - 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  caption: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
