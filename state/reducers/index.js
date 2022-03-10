import { combineReducers } from "redux";
import { usersReducer } from "./usersReducer";
import { currentUserReducer } from "./currentUserReducer";
import { postsReducer } from "./postsReducer";
import { modalReducer } from "./modalReducer";
import { userPostsReducer } from "./userPostsReducer";
export const reducers = combineReducers({
  users: usersReducer,
  currentuser: currentUserReducer,
  posts: postsReducer,
  modal: modalReducer,
  currentuserposts: userPostsReducer,
});
