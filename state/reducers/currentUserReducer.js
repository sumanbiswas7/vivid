const initialInput = {};

export const currentUserReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "currentuser":
      return action.payload;
    default:
      return state;
  }
};
