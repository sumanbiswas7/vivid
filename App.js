import { Provider } from "react-redux";
import { store } from "./state/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { defaultTheme, theme1, theme2 } from "./theme/theme";
import LogIn from "./pages/LogIn";
import CreatePost from "./pages/CreatePost";
import { Likes } from "./pages/Likes";
import { Comments } from "./pages/Comments";
import Profile from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import OtherProfile from "./pages/OtherProfile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Notifications } from "./pages/Notifications";

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
        tabBarStyle: { position: "absolute", backgroundColor: colors.bg_light },
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

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer theme={theme2}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
