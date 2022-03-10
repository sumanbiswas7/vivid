const initialInput = { camera: false, home: false };

export const modalReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "modal":
      return action.payload;
    default:
      return state;
  }
};
