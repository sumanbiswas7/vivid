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
  Modal,
  TouchableWithoutFeedback,
  Button,
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
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StarFill, StarOutline } from "../components/Post/Star";
import { useEffect, useState } from "react";
import { ProfilePost } from "../components/ProfilePost";
import moment from "moment";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { ReportProfileModal } from "../components/Modals/ReportProfileModal";

export default function OtherProfile({ navigation, route }) {
  const { email } = route.params;
  const posts = useSelector((state) => state.posts);
  const currentUserName = useSelector((state) => state.currentuser.username);
  const [totalLikes, setTotalLikes] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currUser, setCurrUser] = useState(false);
  const [curUserPosts, setCurrentuserPosts] = useState([]);

  const setCurrentuserPost = (currUser, posts) => {
    const filteredPost = [];
    for (let j = 0; j < posts.length; j++) {
      const res = posts.filter((ele) => ele.id == currUser.posts[j]);
      if (res[0]) {
        filteredPost.push(res[0]);
      }
    }
    setIsLoaded((p) => ({ ...p, post: true }));
    setCurrentuserPosts(filteredPost.reverse());

    let tempTotalLikes = 0;
    filteredPost.map((p) => (tempTotalLikes += p.likes.likes));
    setTotalLikes(tempTotalLikes);
    console.log("CURRUSER POST LOADED");
  };
  async function getUser() {
    const db = getFirestore();
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCurrUser(docSnap.data());
      setIsLoaded((p) => ({ ...p, user: true }));
      setCurrentuserPost(docSnap.data(), posts);
      console.log("CURRUSER LOADED");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const { colors } = useTheme();
  const DUMMY_TAGS = [
    {
      title: "Tags",
      data: currUser.tags || [],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg_dark }]}>
      {isLoaded.post && isLoaded.user ? (
        <>
          <View style={[styles.header, { backgroundColor: colors.bg_light }]}>
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
            <ReportProfileModal
              id={currUser.email}
              reported_by={currentUserName}
              username={currUser.username}
            />
          </View>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.bg_light,
                paddingTop: SB.currentHeight + 80,
                paddingBottom: 25,
                marginBottom: 5,
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
                      style={[styles.relationship_tex, { color: colors.text }]}
                    >
                      {currUser.status}
                    </Text>
                  </View>
                ) : null}
              </View>
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
                            <Text style={[{ fontSize: 15 }, styles.text]}>
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
              {currUser.ig_link || currUser.git_link || currUser.fb_link ? (
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
                        color={colors.text}
                        size={20}
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
                    <StarFill color={colors.gradient_2} />
                  ) : (
                    <StarOutline color={colors.text} />
                  )}
                  {totalLikes >= 40 ? (
                    <StarFill color={colors.gradient_1} />
                  ) : (
                    <StarOutline color={colors.text} />
                  )}
                </View>
              </View>
            </View>
            {curUserPosts.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={curUserPosts}
                renderItem={({ item }) => {
                  return (
                    <ProfilePost
                      likes={item.likes.likes}
                      img={item.img}
                      userProfile={item.user_data.profile_img}
                      userName={item.user_data.username}
                      caption={item.caption}
                      date={moment(item.date, "DD-MM-YYYY, h:mm a").fromNow()}
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
      <StatusBar style="auto" backgroundColor={colors.bg_light} />
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
    shadowColor: "#000",
    zIndex: 99,
    top: SB.currentHeight,
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

  modalContainer: {
    backgroundColor: "#fff",
    width: 300,
    height: 200,
    borderRadius: 10,
    justifyContent: "space-between",
    overflow: "hidden",
  },
});
