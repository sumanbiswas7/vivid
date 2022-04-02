import { View, Text, Linking } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";
import { useTheme } from "@react-navigation/native";
export const ProfileModal = ({ navigation }) => {
  const { colors } = useTheme();

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
          <MenuOption onSelect={() => navigation.navigate("editprofile")}>
            <Text style={{ color: colors.text, paddingVertical: 5 }}>
              Edit Profile
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() =>
              Linking.openURL("https://sumanbiswas.vercel.app/contact")
            }
          >
            <Text style={{ color: "red", paddingVertical: 5 }}>
              Report Issue
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
