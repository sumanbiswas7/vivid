import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { UserImg } from "./UserImg";
import { VerifiedText } from "./VerifiedText";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import ImageAutoHeight from "react-native-image-auto-height";
import { StarFill, StarOutline } from "./Star";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";

export function Post(props) {
  const currentuser = useSelector((state) => state.currentuser);
  const [liketemp, setLikeTemp] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [temp, setTemp] = useState(null);
  const [newArr, setNewArr] = useState(props.liked_by);
  const { colors } = useTheme();
  useEffect(() => {
    if (props.liked_by.includes(currentuser.email)) {
      setLikeTemp(true);
    }
    setTemp(props.likes);
  }, []);

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

  return (
    <View>
      <Modal animationType="slide" transparent visible={reportModal}>
        <View style={styles.report_view}>
          <Text style={styles.report_text}>Report this post?</Text>
          <TouchableOpacity onPress={() => setReportModal(false)}>
            <Text style={styles.report_btn}>REPORT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReportModal(false)}>
            <Text style={styles.report_btn}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={[styles.header, { backgroundColor: colors.bg_dark }]}>
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
              />
              <Text style={styles.time}>{props.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setReportModal(true);
          }}
          style={styles.other_btn}
        >
          <Entypo name="dots-three-vertical" size={15} />
        </TouchableOpacity>
      </View>
      {props.caption ? (
        <Text style={[styles.caption, { backgroundColor: colors.bg_dark }]}>
          {props.caption}
        </Text>
      ) : null}
      {props.post_img ? (
        <ImageAutoHeight
          style={styles.post_img}
          source={{ uri: props.post_img }}
        />
      ) : null}
      <View style={[styles.footer, { backgroundColor: colors.bg_dark }]}>
        <View style={styles.post_interactions_cont}>
          {liketemp ? (
            <TouchableOpacity
              style={styles.like_box}
              onPress={() => {
                setTemp((p) => p - 1);
                setLikeTemp(false);
                updateLike(props.id, temp - 1, "min");
              }}
            >
              <AntDesign name="like1" size={18} color={"#000"} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.like_box}
                onPress={() => {
                  setTemp((p) => p + 1);
                  setLikeTemp(true);
                  updateLike(props.id, temp + 1, "plus");
                }}
              >
                <AntDesign name="like2" size={18} color={"#000"} />
              </TouchableOpacity>
            </>
          )}
          {temp == 1 ? (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("likes", { liked_by: newArr })
              }
              style={styles.like_text}
            >
              <Text style={styles.post_interactions_text}>
                {temp} Like&nbsp;&nbsp;
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("likes", { liked_by: newArr })
              }
              style={styles.like_text}
            >
              <Text style={styles.post_interactions_text}>{temp} Likes</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("comments", {
              postId: props.id,
              comments: props.comments.reverse(),
            })
          }
          style={[styles.post_interactions_cont]}
        >
          <MaterialCommunityIcons
            name="comment-processing-outline"
            size={18}
            color={"#000"}
            style={{ marginTop: 7 }}
          />
          {props.comments.length == 1 ? (
            <Text style={[styles.post_interactions_text, { marginLeft: 5 }]}>
              {props.comments.length} Comment
            </Text>
          ) : (
            <Text style={[styles.post_interactions_text, { marginLeft: 5 }]}>
              {props.comments.length} Comments&nbsp;&nbsp;
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.post_interactions_cont}
        >
          {temp >= 2 ? <StarFill /> : <StarOutline />}
          {temp >= 5 ? <StarFill /> : <StarOutline />}
          {temp >= 10 ? <StarFill /> : <StarOutline />}
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
