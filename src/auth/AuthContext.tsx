import { FC, ReactNode, createContext, useContext, useState } from "react";
interface UserData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  score?: number;
  wins?: number;
  losses?: number;
  achievements?: string[];
}
interface AuthContextType {
  user: UserData | undefined;
  setUser: (state: UserData) => void;
  isUserLoggedIn: boolean;
  setUserLoggedin: (state: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData>();
  const [isUserLoggedIn, setUserLoggedin] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isUserLoggedIn, setUserLoggedin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
