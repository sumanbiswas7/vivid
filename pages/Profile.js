import {
  View,
  Text,
  StyleSheet,
  StatusBar as SB,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SectionList,
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import BottomNavBar from "../components/BottomNavBar";
import { useSelector } from "react-redux";
import { UserImg } from "../components/Post/UserImg";
import { VerifiedText } from "../components/Post/VerifiedText";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { useTheme } from "@react-navigation/native";
// import MaskedView from "@react-native-masked-view/masked-view";
import MaskedView from "@react-native-community/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StarFill, StarOutline } from "../components/Post/Star";
import { useEffect, useState } from "react";
import { ProfilePost } from "../components/ProfilePost";
import moment from "moment";
import { ProfileModal } from "../components/Modals/ProfileModal";
import { Post } from "../components/Post/Post";

export default function Profile({ navigation }) {
  const currUser = useSelector((state) => state.currentuser);
  const initialLoadContex = useSelector((state) => state.initialLoad);
  const curUserPosts = useSelector((state) => state.currentuserposts);
  const [totalLikes, setTotalLikes] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (curUserPosts) {
      let tempTotalLikes = 0;
      curUserPosts.map((p) => (tempTotalLikes += p.likes_data?.likes));
      setTotalLikes(tempTotalLikes);
      setIsLoaded(true);
    }
  }, [curUserPosts]);
  const { colors } = useTheme();
  const DUMMY_TAGS = [
    {
      title: "Tags",
      data: currUser.tags || [],
    },
  ];
  return (
    <View style={[styles.container, { backgroundColor: colors.bg_dark }]}>
      {isLoaded && initialLoadContex ? (
        <>
          <View style={[styles.header, { backgroundColor: colors.home_fg }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="back" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.header_text, { color: colors.text }]}>
                {currUser.username}
              </Text>
            </View>
            <ProfileModal navigation={navigation} />
          </View>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.bg_light,
                paddingTop: SB.currentHeight + 80,
                paddingBottom: 25,
                marginBottom: 10,
                width: Dimensions.get("window").width,
              }}
            >
              <View
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  borderRadius: 50,
                  elevation: 5,
                }}
              >
                <UserImg profile_img={currUser.profile} size={70} />
              </View>
              <VerifiedText
                text={currUser.fullname}
                isVerified={currUser.isVerified}
                size={25}
                marleft={10}
                color={colors.text}
              />
              {currUser.gender || currUser.status ? (
                <View style={styles.flex_row}>
                  <Text style={[styles.gender, { color: colors.text }]}>
                    {currUser.gender}
                  </Text>
                  {currUser.status ? (
                    <View style={[styles.flex_row]}>
                      {currUser.status == "single" ? (
                        <MaterialCommunityIcons
                          name="heart-broken"
                          size={17}
                          style={{ marginTop: 3 }}
                          color={colors.text}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="heart"
                          size={17}
                          style={{ marginTop: 3 }}
                          color={colors.text}
                        />
                      )}
                      <Text
                        style={[
                          styles.relationship_tex,
                          { color: colors.text },
                        ]}
                      >
                        {currUser.status}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <SafeAreaView>
                  <SectionList
                    sections={DUMMY_TAGS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <MaskedView
                          style={styles.mask}
                          maskElement={
                            <Text style={[styles.text, { fontSize: 15 }]}>
                              {item}
                            </Text>
                          }
                        >
                          <LinearGradient
                            colors={[colors.gradient_1, colors.gradient_2]}
                            start={{ x: 0.9, y: 0.2 }}
                            style={{ flex: 1 }}
                          />
                        </MaskedView>
                      );
                    }}
                  />
                </SafeAreaView>
              </View>
              {currUser.bio ? (
                <Text style={[styles.passion, { color: colors.text }]}>
                  {currUser.bio}
                </Text>
              ) : null}
              {currUser.ig_link ||
              currUser.git_link ||
              currUser.fb_link ||
              currUser.tw_link ? (
                <View style={[styles.flex_row, { marginTop: 10 }]}>
                  {currUser.ig_link ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `https://www.instagram.com/${currUser.ig_link}`
                        )
                      }
                    >
                      <AntDesign
                        style={{ marginHorizontal: 8 }}
                        name="instagram"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {currUser.git_link ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `https://github.com/${currUser.git_link}`
                        )
                      }
                    >
                      <AntDesign
                        style={{ marginHorizontal: 8 }}
                        name="github"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {currUser.fb_link ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `https://www.facebook.com/profile.php?id=${currUser.fb_link}`
                        )
                      }
                    >
                      <AntDesign
                        style={{ marginHorizontal: 8 }}
                        name="facebook-square"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {currUser.tw_link ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `https://twitter.com/${currUser.tw_link}`
                        )
                      }
                    >
                      <AntDesign
                        style={{ marginHorizontal: 8 }}
                        name="twitter"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              <View style={[styles.flex_row, { marginTop: 10 }]}>
                <View style={[styles.flex_row, { marginBottom: 2 }]}>
                  <AntDesign name="like1" size={17} color={colors.text} />
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 13, marginLeft: 4, color: colors.text },
                    ]}
                  >
                    {totalLikes}
                  </Text>
                </View>
                <View style={[styles.flex_row, { marginLeft: 20 }]}>
                  {totalLikes >= 5 ? (
                    <StarFill color={colors.text} />
                  ) : (
                    <StarOutline color={colors.text} />
                  )}
                  {totalLikes >= 25 ? (
                    <StarFill color={colors.gradient_1} />
                  ) : (
                    <StarOutline color={colors.text} />
                  )}
                  {totalLikes >= 40 ? (
                    <StarFill color={colors.gradient_2} />
                  ) : (
                    <StarOutline color={colors.text} />
                  )}
                </View>
              </View>
            </View>
            {curUserPosts.length > 0 ? (
              <FlatList
                style={{ marginBottom: 40 }}
                contentContainerStyle={{ alignItems: "center" }}
                showsVerticalScrollIndicator={false}
                data={curUserPosts}
                renderItem={({ item }) => {
                  return (
                    // <ProfilePost
                    //   // likes={item.likes.likes}
                    //   likes={item.likes_data?.likes}
                    //   img={item.img}
                    //   userProfile={item.user_data.profile_img}
                    //   userName={item.user_data.username}
                    //   caption={item.caption}
                    //   date={moment(item.date, "DD-MM-YYYY, h:mm a").fromNow()}
                    // />
                    <Post
                      username={item.user_data.username}
                      date={moment(item.date, "DD-MM-YYYY, h:mm a").fromNow()}
                      isVerified={item.user_data.isVerified}
                      profile={item.user_data.profile_img}
                      post_img={item.img}
                      caption={item.caption}
                      likes={item.likes_data?.likes}
                      liked_by={item.likes_data?.total_likes}
                      prevLikesBy={item.likes?.total_likes}
                      prevLikesCount={item.likes?.likes}
                      comments={item.comments}
                      id={item.id}
                      email={item.user_data.email}
                      navigation={navigation}
                      bgcol={colors.bg_light}
                      marBottom={10}
                      width={Dimensions.get("window").width - 20}
                    />
                  );
                }}
              />
            ) : (
              <View
                style={[
                  styles.nopost_box,
                  { backgroundColor: colors.bg_light },
                ]}
              >
                <Text style={[styles.nopost_text, { color: colors.text }]}>
                  User doesn't have any post
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator color={colors.gradient_1} size={25} />
      )}
      {/* <StatusBar style="auto" backgroundColor={"#d2d"} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  header: {
    width: Dimensions.get("window").width,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 99,
    top: SB.currentHeight,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  header_text: {
    fontSize: 15,
    fontFamily: "Comfortaa-Medium",
    marginLeft: 10,
  },
  gender: {
    fontFamily: "Comfortaa-Light",
    marginBottom: 3,
    marginRight: 10,
    fontSize: 13,
    color: "#444444",
  },
  flex_row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  relationship_tex: {
    marginLeft: 1,
    fontSize: 14,
    color: "#444444",
  },

  mask: {
    height: 30,
    width: 90,
  },
  text: {
    fontFamily: "Comfortaa-Medium",
    textAlign: "center",
  },
  passion: {
    fontFamily: "Comfortaa-Light",
    marginBottom: 3,
    fontSize: 13,
    color: "#444444",
    maxWidth: Dimensions.get("window").width - 50,
  },
  nopost_box: {
    width: Dimensions.get("window").width - 20,
    alignItems: "center",
    paddingVertical: 30,
    marginTop: 10,
  },
  nopost_text: {
    fontFamily: "Comfortaa-Medium",
  },
});
