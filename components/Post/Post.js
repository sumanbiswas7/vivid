import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { UserImg } from "./UserImg";
import { VerifiedText } from "./VerifiedText";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import ImageAutoHeight from "react-native-image-auto-height";
import { StarFill, StarOutline } from "./Star";
import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { ReportPostModal } from "../Modals/ReportPostModal";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/index";
import { bindActionCreators } from "redux";

export function Post(props) {
  const currentuser = useSelector((state) => state.currentuser);
  const allposts = useSelector((state) => state.posts);
  const { setCurrentUser, setPosts } = bindActionCreators(
    actionCreators,
    useDispatch()
  );
  const [liketemp, setLikeTemp] = useState(false);
  const [temp, setTemp] = useState(null);
  const [newArr, setNewArr] = useState(props.liked_by);
  const { colors } = useTheme();

  useEffect(() => {
    if (!props.liked_by) {
      // if (props.prevLikesBy.includes(currentuser.email)) {
      //   setLikeTemp(true);
      // }
      setTemp(props.prevLikesCount);
    } else {
      const isLikedByUser = props.liked_by?.filter(
        (o) => o.by == currentuser.email
      );
      if (isLikedByUser && isLikedByUser.length > 0) {
        if (isLikedByUser[0].by == currentuser.email) {
          // Post is liked by user
          setLikeTemp(true);
        }
      }
      setTemp(props.likes);
    }
  }, []);

  const setNotification = async (user, type) => {
    if (type == "like" && currentuser.email != props.email) {
      const docRef = doc(getFirestore(), "users", user);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data.notification) {
        for (let i = 0; i < data.notification.length; i++) {
          if (
            data.notification[i].by == currentuser.username &&
            data.notification[i].img == props.post_img
          ) {
            return;
          }
        }
        const newNotArr = [
          ...docSnap.data().notification,
          {
            type: "like",
            by: currentuser.username,
            img: props.post_img,
            timestamp: new Date().toString(),
          },
        ];
        await updateDoc(docRef, {
          notification: newNotArr,
        });
      } else {
        const newNotArr = [
          {
            type: "like",
            by: currentuser.username,
            img: props.post_img,
            timestamp: new Date().toString(),
          },
        ];
        await updateDoc(docRef, {
          notification: newNotArr,
        });
      }
    }
  };
  const updatePostRef = async (user, postId, type) => {
    const db = getFirestore();
    const userRef = doc(db, "users", user);
    if (currentuser.liked_posts) {
      let liked_posts = [...currentuser.liked_posts];
      if (type == "plus") {
        const new_liked_posts = [
          ...liked_posts.filter((o) => o != postId),
          postId,
        ];
        const newCurrUser = { ...currentuser, liked_posts: new_liked_posts };
        setCurrentUser(newCurrUser);
        await updateDoc(userRef, {
          liked_posts: new_liked_posts,
        });
      } else {
        // TYPE == MINUS
        const new_liked_posts = [...liked_posts.filter((o) => o != postId)];
        const newCurrUser = { ...currentuser, liked_posts: new_liked_posts };
        setCurrentUser(newCurrUser);
        await updateDoc(userRef, {
          liked_posts: new_liked_posts,
        });
      }
    } else {
      if (type == "plus") {
        const newCurrUser = { ...currentuser, liked_posts: [postId] };
        setCurrentUser(newCurrUser);
        await updateDoc(userRef, {
          liked_posts: [postId],
        });
      } else {
        // TYPE == MINUS
        const newCurrUser = { ...currentuser, liked_posts: [] };
        setCurrentUser(newCurrUser);
        await updateDoc(userRef, {
          liked_posts: [],
        });
      }
    }
  };
  const updateLike = async (id, count, type) => {
    const db = getFirestore();
    const likeRef = doc(db, "posts", id);
    try {
      if (type == "plus") {
        const newArr = [...props.liked_by, currentuser.email].filter(function (
          item,
          pos,
          self
        ) {
          return self.indexOf(item) == pos;
        });
        setNewArr(newArr);
        await updateDoc(likeRef, {
          likes: {
            likes: count,
            total_likes: newArr,
          },
        });
        setNotification(props.email, "like");
      } else {
        const newArr = [...props.liked_by].filter(
          (e) => e !== currentuser.email
        );
        setNewArr(newArr);
        await updateDoc(likeRef, {
          likes: {
            likes: count,
            total_likes: newArr,
          },
        });
      }
    } catch (error) {
      console.log("Post -> UPDATE LIKE ERR" + error);
    }
  };
  const updateLikeNew = async (id, count, type) => {
    if (!props.liked_by) return;
    const db = getFirestore();
    const likeRef = doc(db, "posts", id);
    if (type == "plus") {
      if (temp === 0) {
        // If the post has 0 likes
        setTemp(1);
        setNewArr([
          {
            by: currentuser.email,
            username: currentuser.username,
            isVerified: currentuser.isVerified,
            profile: currentuser.profile,
          },
        ]);
        updatePostLikes(count, {
          by: currentuser.email,
          username: currentuser.username,
          isVerified: currentuser.isVerified,
          profile: currentuser.profile,
        });
        await updateDoc(likeRef, {
          likes_data: {
            likes: count,
            total_likes: [
              {
                by: currentuser.email,
                username: currentuser.username,
                isVerified: currentuser.isVerified,
                profile: currentuser.profile,
              },
            ],
          },
        });
        setNotification(props.email, "like");
        updatePostRef(currentuser.email, id, "plus");
        return;
      }
      const newArr = [...props.liked_by].filter((o) => {
        return o.by != currentuser.email;
      });
      newArr.push({
        by: currentuser.email,
        username: currentuser.username,
        isVerified: currentuser.isVerified,
        profile: currentuser.profile,
      });
      // updating likes before navigation
      setNewArr(newArr);
      updatePostLikes(count, newArr);
      await updateDoc(likeRef, {
        likes_data: {
          likes: count,
          total_likes: newArr,
        },
      });
      setNotification(props.email, "like");
      updatePostRef(currentuser.email, id, "plus");
    } else {
      // unlike post
      if (temp === 1) {
        setTemp(0);
        setNewArr([]);
        updatePostLikes(count, []);
        await updateDoc(likeRef, {
          likes_data: {
            likes: count,
            total_likes: [],
          },
        });
        updatePostRef(currentuser.email, id, "minus");
        return;
      }
      const newArr = [...props.liked_by].filter((o) => {
        return o.by != currentuser.email;
      });
      setNewArr(newArr);
      updatePostLikes(count, newArr);
      await updateDoc(likeRef, {
        likes_data: {
          likes: count,
          total_likes: newArr,
        },
      });
      updatePostRef(currentuser.email, id, "minus");
    }
  };
  const updatePostLikes = (likeCount, likeObj) => {
    // setTimeout(() => {
    //   const singlePost = allposts.filter((o) => {
    //     return o.id == props.id;
    //   });
    //   const newlikedata = {
    //     ...singlePost[0],
    //     likes_data: {
    //       likes: likeCount,
    //       total_likes: likeObj,
    //     },
    //   };
    //   const idx = allposts.findIndex((o) => {
    //     return o.id == props.id;
    //   });
    //   const newAllPost = [...allposts];
    //   newAllPost[idx] = newlikedata;
    //   setPosts(newAllPost);
    // }, 1);
    console.log(likeCount, likeObj);
  };

  return (
    <View>
      <View
        style={[
          styles.header,
          {
            backgroundColor: props.bgcol || colors.home_fg,
            width: props.width,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("otherprofile", { email: props.email })
          }
        >
          <View style={styles.profile_name_container}>
            <UserImg profile_img={props.profile} />
            <View style={styles.name_time_text_container}>
              <VerifiedText
                isVerified={props.isVerified}
                text={props.username}
                size={14}
                color={colors.text}
              />
              <Text style={[styles.time, { color: colors.text }]}>
                {props.date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <ReportPostModal
          id={props.id}
          img={props.post_img}
          caption={props.caption}
          user={props.username}
          reported_by={currentuser.username}
          useremail={props.email}
          navigation={props.navigation}
        />
      </View>
      {props.caption ? (
        <Text
          style={[
            styles.caption,
            {
              backgroundColor: props.bgcol || colors.home_fg,
              color: colors.text,
              width: props.width,
            },
          ]}
        >
          {props.caption}
        </Text>
      ) : null}
      {props.post_img ? (
        <ImageAutoHeight
          style={[
            styles.post_img,
            {
              width: props.width,
              height: "auto",
            },
          ]}
          source={{ uri: props.post_img }}
        />
      ) : null}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: props.bgcol || colors.home_fg,
            marginBottom: props.marBottom,
            width: props.width,
          },
        ]}
      >
        <View style={styles.post_interactions_cont}>
          {liketemp ? (
            <TouchableOpacity
              style={styles.like_box}
              onPress={() => {
                setTemp((p) => p - 1);
                setLikeTemp(false);
                updateLikeNew(props.id, temp - 1, "min");
              }}
            >
              <AntDesign name="like1" size={18} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.like_box}
                onPress={() => {
                  setTemp((p) => p + 1);
                  setLikeTemp(true);
                  updateLikeNew(props.id, temp + 1, "plus");
                }}
              >
                <AntDesign name="like2" size={18} color={colors.text} />
              </TouchableOpacity>
            </>
          )}
          {temp == 1 ? (
            <TouchableOpacity
              onPress={() => {
                if (props.liked_by) {
                  props.navigation.navigate("likes", { liked_by: newArr });
                }
              }}
              style={styles.like_text}
            >
              <Text
                style={[styles.post_interactions_text, { color: colors.text }]}
              >
                {temp} Like&nbsp;&nbsp;
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (props.liked_by) {
                  props.navigation.navigate("likes", { liked_by: newArr });
                }
              }}
              style={styles.like_text}
            >
              <Text
                style={[styles.post_interactions_text, { color: colors.text }]}
              >
                {temp} Likes
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("comments", {
              postId: props.id,
              comments: props.comments.reverse(),
              postImg: props.post_img,
              userId: props.email,
            })
          }
          style={[styles.post_interactions_cont]}
        >
          <MaterialCommunityIcons
            name="comment-processing-outline"
            size={18}
            color={colors.text}
            style={{ marginTop: 7 }}
          />
          {props.comments.length == 1 ? (
            <Text
              style={[
                styles.post_interactions_text,
                { marginLeft: 5, color: colors.text },
              ]}
            >
              {props.comments.length} Comment
            </Text>
          ) : (
            <Text
              style={[
                styles.post_interactions_text,
                { marginLeft: 5, color: colors.text },
              ]}
            >
              {props.comments.length} Comments&nbsp;&nbsp;
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.post_interactions_cont}
        >
          {temp >= 2 ? (
            <StarFill color={colors.text} />
          ) : (
            <StarOutline color={colors.text} />
          )}
          {temp >= 8 ? (
            <StarFill color={colors.gradient_2} />
          ) : (
            <StarOutline color={colors.text} />
          )}
          {temp >= 10 ? (
            <StarFill color={colors.gradient_1} />
          ) : (
            <StarOutline color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: Dimensions.get("window").width - 15,
    backgroundColor: "#E3E3E3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
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
  },
  caption: {
    backgroundColor: "#E3E3E3",
    width: Dimensions.get("window").width - 15,
    // fontFamily: "Comfortaa-Light",
    paddingHorizontal: 20,
    fontSize: 13,
    paddingVertical: 6,
  },
  post_img: {
    height: "auto",
    width: Dimensions.get("window").width - 15,
  },
  footer: {
    marginBottom: 5,
    backgroundColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingBottom: 3,
  },
  post_interactions_cont: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    // backgroundColor: "green",
    paddingVertical: 2,
  },
  post_interactions_text: {
    fontSize: 10,
    marginTop: 5,
  },
  like_box: {
    height: 35,
    width: 27,
    paddingTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  like_text: {
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  // REPORT MODAL
  report_view: {
    backgroundColor: "#fff",
    bottom: 0,
    position: "absolute",
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  report_text: {
    fontSize: 20,
    paddingVertical: 10,
  },
  report_btn: {
    paddingVertical: 10,
  },
});
