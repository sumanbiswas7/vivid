import { View, Text, Alert, ToastAndroid } from "react-native";
import { collection, addDoc, getFirestore } from "firebase/firestore";
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

export const ReportPostModal = ({
  navigation,
  id,
  img,
  caption,
  user,
  reported_by,
}) => {
  const { colors } = useTheme();
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
          <Text style={{ fontSize: 18, paddingBottom: 10, color: colors.text }}>
            Report this post ?
          </Text>
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
            <Text style={{ color: colors.text, paddingVertical: 8 }}>YES</Text>
          </MenuOption>
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
