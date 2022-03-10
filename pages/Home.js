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
import BottomNavBar from "../components/BottomNavBar";
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

export default function Home({ navigation }) {
  const [initialLoad, setInitialLoad] = useState(false);
  const [postLoad, setPostLoad] = useState(false);
  const [currPostsload, setCurrPostLoad] = useState(false);
  const { setCurrentuserPosts, setCurrentUser, setPosts } = bindActionCreators(
    actionCreators,
    useDispatch()
  );
  const posts = useSelector((state) => state.posts);
  const currUser = useSelector((state) => state.currentuser);
  const auth = getAuth();
  const { colors } = useTheme();

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
      query(postRef, orderBy("date", "desc"), limit(100))
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
    setCurrentuserPosts(filteredPost);
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
    }
  }, [postLoad, initialLoad]);

  return (
    <>
      {initialLoad && postLoad && currPostsload ? (
        <View style={[styles.container, { backgroundColor: colors.bg_light }]}>
          <HeaderTop navigation={navigation} />
          <View style={[{ color: colors.primary }, styles.view]}>
            <FlatList
              style={styles.posts_list}
              showsVerticalScrollIndicator={false}
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
                    likes={item.likes.likes}
                    liked_by={item.likes.total_likes}
                    comments={item.comments}
                    id={item.id}
                    email={item.user_data.email}
                    navigation={navigation}
                  />
                );
              }}
            />
          </View>
          {/* <BottomNavBar navigation={navigation} /> */}
        </View>
      ) : (
        <CircleLoader size={20} />
      )}
      <ESB style="auto" color={colors.bg_light} />
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
    marginTop: StatusBar.currentHeight + 60,
    // marginBottom: 55,
    // backgroundColor: "#d2d",
  },
});
