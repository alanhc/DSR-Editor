import { createContext } from "react";

export const AuthContext = createContext({
  authState: {
    isLoggedIn: false,
    walletAddr: "",
  },
  authDispatcher: () => {},
});
