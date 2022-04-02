import { Provider } from "react-redux";
import { store } from "./state/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import {
  theme0,
  theme1,
  theme2,
  theme3,
  theme4,
  theme5,
  theme6,
  theme7,
  dark1,
  dark2,
  dark3,
  dark4,
  dark5,
  dark6,
  dark7,
  dark8,
} from "./theme/theme";
import LogIn from "./pages/LogIn";
import CreatePost from "./pages/CreatePost";
import { Likes } from "./pages/Likes";
import { Comments } from "./pages/Comments";
import Profile from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import OtherProfile from "./pages/OtherProfile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Notifications } from "./pages/Notifications";
import { Themes } from "./pages/Themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useLayoutEffect } from "react";
import { createContext } from "react";
import Onboarding from "react-native-onboarding-swiper";
import ImageAutoHeight from "react-native-image-auto-height";
import { Dimensions } from "react-native";
import { MenuProvider } from "react-native-popup-menu";

const Tab = createBottomTabNavigator();
function BottomTabNav() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      sceneContainerStyle={{}}
      screenOptions={{
        tabBarActiveTintColor: colors.bottom_tab,
        headerShown: false,
        tabBarStyle: { position: "absolute", backgroundColor: colors.home_fg },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={CreatePost}
        options={{
          tabBarLabel: "Add Post",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export const ThemeContext = createContext();
export default function App() {
  const Stack = createNativeStackNavigator();
  const [theme, setTheme] = useState(theme0);
  const themedata = { theme, setTheme };
  const [firstLoad, setFirstLoad] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem("theme").then((value) => {
      if (value == "theme0") setTheme(theme0);
      if (value == "theme1") setTheme(theme1);
      if (value == "theme2") setTheme(theme2);
      if (value == "theme3") setTheme(theme3);
      if (value == "theme4") setTheme(theme4);
      if (value == "theme5") setTheme(theme5);
      if (value == "theme6") setTheme(theme6);
      if (value == "theme7") setTheme(theme7);
      if (value == "dark1") setTheme(dark1);
      if (value == "dark2") setTheme(dark2);
      if (value == "dark3") setTheme(dark3);
      if (value == "dark4") setTheme(dark4);
      if (value == "dark5") setTheme(dark5);
      if (value == "dark6") setTheme(dark6);
      if (value == "dark7") setTheme(dark7);
      if (value == "dark8") setTheme(dark8);
    });
    AsyncStorage.getItem("firstLoad").then((value) => {
      if (value != "2.0.2") {
        AsyncStorage.setItem("firstLoad", "2.0.2");
        setFirstLoad(true);
      } else {
        setFirstLoad(false);
      }
    });
  }, []);

  if (firstLoad) {
    return (
      <Onboarding
        onDone={() => setFirstLoad(false)}
        onSkip={() => setFirstLoad(false)}
        controlStatusBar={false}
        pages={[
          {
            image: (
              <ImageAutoHeight
                style={{
                  width: Dimensions.get("window").width - 20,
                  height: "auto",
                }}
                source={require("./assets/theme_ob.png")}
              />
            ),
            backgroundColor: "#fff",
            title: "Themes",
            subTitleStyles: {
              marginBottom: 30,
            },
            subtitle:
              "is it fair not to let you choose your favorite color? well, we don't think so, after all, everyone should appreciate one's pick. so here comes vivid with theme feature. now choose your theme from a plethora of options.",
          },

          {
            image: (
              <ImageAutoHeight
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: "auto",
                }}
                source={require("./assets/improve_ob.png")}
              />
            ),
            backgroundColor: "#fff",
            title: "Improvements",
            subTitleStyles: {
              marginBottom: 60,
            },
            subtitle:
              "vivid 2.0 comes with an improved user experience, faster loadings, optimized database access and an improved UI.",
          },
        ]}
      />
    );
  }
  return (
    <Provider store={store}>
      <MenuProvider>
        <ThemeContext.Provider value={themedata}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator
              initialRouteName="home"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="home" component={BottomTabNav} />
              <Stack.Screen name="profile" component={Profile} />
              <Stack.Screen name="signup" component={SignUp} />
              <Stack.Screen name="login" component={LogIn} />
              <Stack.Screen name="createpost" component={CreatePost} />
              <Stack.Screen name="likes" component={Likes} />
              <Stack.Screen name="comments" component={Comments} />
              <Stack.Screen name="otherprofile" component={OtherProfile} />
              <Stack.Screen name="editprofile" component={EditProfile} />
              <Stack.Screen name="notifications" component={Notifications} />
              <Stack.Screen name="themes" component={Themes} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeContext.Provider>
      </MenuProvider>
    </Provider>
  );
}
