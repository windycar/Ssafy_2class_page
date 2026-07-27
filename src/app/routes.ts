import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./Root";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const LoginView = lazy(() => import("../views/LoginView"));
const HomeView = lazy(() => import("../views/HomeView"));
const TeamRandomView = lazy(() => import("../views/TeamRandomView"));
const CoffeeOrderView = lazy(() => import("../views/CoffeeOrderView"));
const GalleryView = lazy(() => import("../views/GalleryView"));
const GroundRulesView = lazy(() => import("../views/GroundRulesView"));
const AnonymousBoardView = lazy(() => import("../views/AnonymousBoardView"));
const AdminView = lazy(() => import("../views/AdminView"));
const GameHubView = lazy(() => import("../views/GameHubView"));
const BangGameView = lazy(() => import("../views/games/BangGameView"));
const BangRoomView = lazy(() => import("../views/games/BangRoomView"));
const BangPlayView = lazy(() => import("../views/games/BangPlayView"));
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
      { path: "game-login", Component: LoginView },
      {
        Component: ProtectedRoute,
        children: [
          { path: "games", Component: GameHubView },
          { path: "games/bang", Component: BangGameView },
          { path: "games/bang/:roomId", Component: BangRoomView },
          { path: "games/bang/:roomId/play", Component: BangPlayView },
        ],
      },
      { path: "*", Component: NotFoundView },
    ],
  },
]);
