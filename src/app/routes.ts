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
const MyInfoView = lazy(() => import("../views/MyInfoView"));
const GameHubView = lazy(() => import("../views/GameHubView"));
const BangGameView = lazy(() => import("../views/games/BangGameView"));
const BangRoomView = lazy(() => import("../views/games/BangRoomView"));
const BangPlayView = lazy(() => import("../views/games/BangPlayView"));
const StudyHubView = lazy(() => import("../views/study/StudyHubView"));
const PythonStudyView = lazy(() => import("../views/study/PythonStudyView"));
const PythonQuizView = lazy(() => import("../views/study/PythonQuizView"));
const StudyReportView = lazy(() => import("../views/study/StudyReportView"));
const WebStudyView = lazy(() => import("../views/study/WebStudyView"));
const WebQuizView = lazy(() => import("../views/study/WebQuizView"));
const WebStudyReportView = lazy(() => import("../views/study/WebStudyReportView"));
const AiPythonStudyView = lazy(() => import("../views/study/AiPythonStudyView"));
const AiPythonQuizView = lazy(() => import("../views/study/AiPythonQuizView"));
const AiPythonWeekStudyView = lazy(
  () => import("../views/study/AiPythonWeekStudyView"),
);
const AiPythonWeekQuizView = lazy(
  () => import("../views/study/AiPythonWeekQuizView"),
);
const AttendanceDocumentView = lazy(() => import("../views/AttendanceDocumentView"));
const NotFoundView = lazy(() => import("../views/NotFoundView"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { path: "login", Component: LoginView },
      { path: "game-login", Component: LoginView },
      {
        Component: ProtectedRoute,
        children: [
          { index: true, Component: HomeView },
          { path: "me", Component: MyInfoView },
          { path: "teams", Component: TeamRandomView },
          { path: "coffee", Component: CoffeeOrderView },
          { path: "gallery", Component: GalleryView },
          { path: "ground-rules", Component: GroundRulesView },
          { path: "board", Component: AnonymousBoardView },
          { path: "admin", Component: AdminView },
          { path: "games", Component: GameHubView },
          { path: "games/bang", Component: BangGameView },
          { path: "games/bang/:roomId", Component: BangRoomView },
          { path: "games/bang/:roomId/play", Component: BangPlayView },
          { path: "study", Component: StudyHubView },
          { path: "study/python", Component: PythonStudyView },
          { path: "study/python/quiz", Component: PythonQuizView },
          { path: "study/report", Component: StudyReportView },
          { path: "study/web", Component: WebStudyView },
          { path: "study/web/quiz", Component: WebQuizView },
          { path: "study/web/report", Component: WebStudyReportView },
          { path: "study/ai-python", Component: AiPythonStudyView },
          { path: "study/ai-python/quiz", Component: AiPythonQuizView },
          { path: "study/ai-python/:week", Component: AiPythonWeekStudyView },
          { path: "study/ai-python/:week/quiz", Component: AiPythonWeekQuizView },
          { path: "attendance", Component: AttendanceDocumentView },
          { path: "*", Component: NotFoundView },
        ],
      },
    ],
  },
]);
