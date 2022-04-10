import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../state/index";
import { useTheme } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import useFonts from "../hooks/useFonts";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { CircleLoader } from "../components/CircleLoader";
import { HeaderTop } from "../components/Header/HeaderTop";
import { Post } from "../components/Post/Post";
import moment from "moment";
import { StatusBar as ESB } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function Home({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [initialLoad, setInitialLoad] = useState(false);
  const [postLoad, setPostLoad] = useState(false);
  const [likeChange, setChangedLikes] = useState();
  const [currPostsload, setCurrPostLoad] = useState(false);
  const {
    setCurrentuserPosts,
    setCurrentUser,
    setPosts,
    setInitialLoadContex,
  } = bindActionCreators(actionCreators, useDispatch());
  const posts = useSelector((state) => state.posts);
  const currUser = useSelector((state) => state.currentuser);
  const auth = getAuth();
  const { colors, type } = useTheme();

  const loadAndSetCurrUser = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, "users", getAuth().currentUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data());
        setInitialLoad(true);
        console.log("CURRUSER LOADED");
      } else {
        console.log("Home -> USER NOT FOUND");
      }
    } catch (error) {
      console.log("HOME ->" + error);
    }
  };
  const loadAndSetPosts = async () => {
    const db = getFirestore();
    const postRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(postRef, orderBy("timestamp", "desc"), limit(40))
    );
    const POSTS = [];
    querySnapshot.forEach((doc) => {
      POSTS.push(doc.data());
    });
    setPosts(POSTS);
    setPostLoad(true);
    console.log("POST LOADED");
  };
  const setCurrentuserPost = (user, posts) => {
    const filteredPost = [];
    for (let j = 0; j < posts.length; j++) {
      const res = posts.filter((ele) => ele.id == user.posts[j]);
      if (res[0]) {
        filteredPost.push(res[0]);
      }
    }
    setCurrentuserPosts(filteredPost.reverse());
    setCurrPostLoad(true);
    console.log("CURRUSER POST LOADED");
  };
  const getFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("signup");
      } else {
        loadAndSetCurrUser();
      }
    });
    loadAndSetPosts();
    getFonts();
  }, []);
  useEffect(() => {
    if (postLoad && initialLoad) {
      setCurrentuserPost(currUser, posts);
      setInitialLoadContex(true);
    }
  }, [postLoad, initialLoad]);

  return (
    <>
      {initialLoad && postLoad && currPostsload ? (
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.home_bg,
            },
          ]}
        >
          <HeaderTop navigation={navigation} />
          <View style={[{ color: colors.primary }, styles.view]}>
            <FlatList
              style={[styles.posts_list, { marginBottom: tabBarHeight }]}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              data={posts}
              renderItem={({ item }) => {
                return (
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
                    marBottom={5}
                    width={Dimensions.get("window").width - 15}
                  />
                );
              }}
            />
          </View>
          {type == "dark" ? (
            <ESB style="light" backgroundColor={colors.home_fg} />
          ) : (
            <ESB style="dark" backgroundColor={colors.home_fg} />
          )}
        </View>
      ) : (
        <CircleLoader size={20} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  posts_list: {
    marginTop: StatusBar.currentHeight + 55,
    paddingTop: 5,
  },
});
