import { View, Text } from "react-native";
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

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Profile}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
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
          <Stack.Screen
            screenOptions={{ headerShown: true }}
            name="editprofile"
            component={EditProfile}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
