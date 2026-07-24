import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFoundView() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="font-mono text-6xl font-extrabold text-blue-100 mb-4">404</div>
      <h1 className="text-xl font-bold text-gray-700 mb-2">페이지를 찾을 수 없습니다.</h1>
      <p className="text-sm text-gray-400 mb-6">잘못된 주소이거나 삭제된 페이지입니다.</p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
      >
        <Home className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
