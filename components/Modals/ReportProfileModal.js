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

export const ReportProfileModal = ({
  navigation,
  id,
  reported_by,
  username,
}) => {
  const { colors } = useTheme();
  async function handleReport() {
    ToastAndroid.show("Thanks for reporting", ToastAndroid.SHORT);
    const db = getFirestore();
    await addDoc(collection(db, "reports"), {
      user_id: id,
      username,
      reported_by,
      reported_on: new Date(),
    });
  }
  return (
    <View>
      <Menu>
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
            optionsWrapper: { backgroundColor: colors.bg_light },
          }}
        >
          <MenuOption
            onSelect={() =>
              Alert.alert("would you like to report this profile ?", "", [
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
            <Text style={{ color: "red", paddingVertical: 5 }}>
              Report Profile
            </Text>
          </MenuOption>
          <MenuOption>
            <Text style={{ color: colors.text, paddingVertical: 5 }}>
              Close
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};
