import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../theme/ThemeContext";
import { AuthProvider } from "../auth/authContext";

const MainLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default MainLayout;
