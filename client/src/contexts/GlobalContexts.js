import { createContext } from "react";

export const GlobalContext = createContext({
  currentUser: null,
  isCurrentUserLoading: false,
});