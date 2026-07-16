import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home-page";
import { ServicesPage } from "./pages/services-page";
import { ConsultingPage } from "./pages/consulting-page";
import { AboutPage } from "./pages/about-page";
import { LoginPage } from "./pages/login-page";
import { Layout } from "./components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "services", Component: ServicesPage },
      { path: "consulting", Component: ConsultingPage },
      { path: "about", Component: AboutPage },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);
