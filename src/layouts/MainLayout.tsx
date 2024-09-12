import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../theme/ThemeContext";
import { AuthProvider } from "../auth/authContext";
import { AppProvider } from "../AppContext";

const MainLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default MainLayout;
