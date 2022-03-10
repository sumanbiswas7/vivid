const initialInput = [];

export const userPostsReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "curruserposts":
      return action.payload;
    default:
      return state;
  }
};
