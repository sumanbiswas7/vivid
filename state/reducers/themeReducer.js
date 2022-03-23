const theme0 = {
  colors: {
    gradient_1: "#FF416C",
    gradient_2: "#FF4B2B",
    notification: "#FF4B2B",
    modal: "#FF416C",
    bg_light: "#fff",
    bg_dark: "#ebebeb",
    bottom_tab: "#FF416C",
  },
};

export const themeReducer = (state = theme0, action) => {
  switch (action.type) {
    case "theme":
      return action.payload;
    default:
      return state;
  }
};
