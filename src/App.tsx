import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import "./styles/app.scss";
import SignupPage from "./pages/SignupPage";
import RandomMatchmakingPage from "./pages/RandomMatchmakingPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/play/random-match" element={<RandomMatchmakingPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
