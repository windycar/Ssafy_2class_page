import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./Root";

const HomeView = lazy(() => import("../views/HomeView"));
const TeamRandomView = lazy(() => import("../views/TeamRandomView"));
const CoffeeOrderView = lazy(() => import("../views/CoffeeOrderView"));
const GalleryView = lazy(() => import("../views/GalleryView"));
const GroundRulesView = lazy(() => import("../views/GroundRulesView"));
const AnonymousBoardView = lazy(() => import("../views/AnonymousBoardView"));
const AdminView = lazy(() => import("../views/AdminView"));
const NotFoundView = lazy(() => import("../views/NotFoundView"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeView },
      { path: "teams", Component: TeamRandomView },
      { path: "coffee", Component: CoffeeOrderView },
      { path: "gallery", Component: GalleryView },
      { path: "ground-rules", Component: GroundRulesView },
      { path: "board", Component: AnonymousBoardView },
      { path: "admin", Component: AdminView },
      { path: "*", Component: NotFoundView },
    ],
  },
]);
