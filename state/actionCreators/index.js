export const setCurrentUser = (currentUser) => {
  return (dispatch) => {
    dispatch({
      type: "currentuser",
      payload: currentUser,
    });
  };
};
export const setPosts = (posts) => {
  return (dispatch) => {
    dispatch({
      type: "posts",
      payload: posts,
    });
  };
};
export const toggleModal = (bool) => {
  return (dispatch) => {
    dispatch({
      type: "modal",
      payload: bool,
    });
  };
};
export const setCurrentuserPosts = (posts) => {
  return (dispatch) => {
    dispatch({
      type: "curruserposts",
      payload: posts,
    });
  };
};
export const setInitialLoadContex = (bool) => {
  return (dispatch) => {
    dispatch({
      type: "initialLoad",
      payload: bool,
    });
  };
};
export const setTheme = (theme) => {
  return (dispatch) => {
    dispatch({
      type: "theme",
      payload: theme,
    });
  };
};
