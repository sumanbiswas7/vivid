const initialInput = false;

export const initialLoadReducer = (state = initialInput, action) => {
  switch (action.type) {
    case "initialLoad":
      return action.payload;
    default:
      return state;
  }
};
