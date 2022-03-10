import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    "Comfortaa-Light": require("../assets/fonts/Comfortaa-Light.ttf"),
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "CabinSketch-Regular": require("../assets/fonts/CabinSketch-Regular.ttf"),
  });
