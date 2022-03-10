const initialInput = {};

export const postsReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "posts":
      return action.payload;
    default:
      return state;
  }
};
