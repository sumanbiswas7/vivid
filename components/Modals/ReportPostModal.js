import { View, Text, Alert, ToastAndroid } from "react-native";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";
import { useTheme } from "@react-navigation/native";
import { renderers } from "react-native-popup-menu";
const { SlideInMenu } = renderers;
import { useSelector } from "react-redux";
import { doc, deleteDoc } from "firebase/firestore";

export const ReportPostModal = ({
  navigation,
  id,
  img,
  caption,
  user,
  reported_by,
  useremail,
}) => {
  const { colors } = useTheme();
  const currUser = useSelector((state) => state.currentuser);
  async function handleReport() {
    ToastAndroid.show("Thanks for reporting", ToastAndroid.SHORT);
    const db = getFirestore();
    await addDoc(collection(db, "reports"), {
      post_id: id,
      post_caption: caption,
      post_img: img,
      post_user: user,
      reported_by,
      reported_on: new Date(),
    });
  }
  async function deletePost() {
    const db = getFirestore();
    // deleting post document from posts
    await deleteDoc(doc(db, "posts", id)).then(() => {
      navigation.replace("home");
      ToastAndroid.show("Post Deleted", ToastAndroid.SHORT);
    });
    // deleting post id from users/posts array
    let newPosts = [...currUser.posts];
    newPostsArr = newPosts.filter((e) => e !== id);
    await updateDoc(doc(db, "users", currUser.email), {
      posts: newPostsArr,
    });
  }
  return (
    <View>
      <Menu renderer={SlideInMenu}>
        <MenuTrigger
          customStyles={{
            triggerWrapper: {
              padding: 8,
              borderRadius: 50,
              marginRight: -8,
            },
          }}
        >
          <Entypo name="dots-three-vertical" size={15} color={colors.text} />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsWrapper: {
              backgroundColor: colors.bg_light,
              paddingHorizontal: 10,
              paddingTop: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <MenuOption
            onSelect={() =>
              Alert.alert("would you like to report this post ?", "", [
                {
                  text: "NO",
                },
                {
                  text: "YES",
                  onPress: () => {
                    handleReport();
                  },
                },
              ])
            }
          >
            <Text style={{ color: colors.text, paddingVertical: 8 }}>
              REPORT
            </Text>
          </MenuOption>
          {currUser.email == useremail ? (
            <MenuOption
              onSelect={() =>
                Alert.alert("Are you sure you want to delete this post ?", "", [
                  {
                    text: "NO",
                  },
                  {
                    text: "YES",
                    onPress: () => {
                      deletePost();
                    },
                  },
                ])
              }
            >
              <Text style={{ color: "red", paddingVertical: 8 }}>DELETE</Text>
            </MenuOption>
          ) : null}
          <MenuOption>
            <Text style={{ color: colors.text, paddingVertical: 8 }}>
              CANCEL
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};
