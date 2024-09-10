import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../theme/ThemeContext";

const MainLayout = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};

export default MainLayout;
