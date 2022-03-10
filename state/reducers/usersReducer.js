const initialInput = {};

export const usersReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "users":
      return action.payload;
    default:
      return state;
  }
};
