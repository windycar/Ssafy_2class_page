import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowRight, Eye, LockKeyhole, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { NAV_ITEMS } from "../config/navigation";

type PreviewSection = {
  title: string;
  description: string;
  example: string;
  cards: { title: string; detail: string }[];
};

const PREVIEWS: Record<string, PreviewSection> = {
  teams: {
    title: "랜덤 팀 편성",
    description: "반과 인원을 선택해 팀을 나누는 화면입니다.",
    example: "가상 편성 예시",
    cards: [
      { title: "1팀", detail: "체험 참가자 A · 체험 참가자 B" },
      { title: "2팀", detail: "체험 참가자 C · 체험 참가자 D" },
      { title: "편성 도구", detail: "인원 조정 · 팀 재배치 · 결과 복사" },
    ],
  },
  coffee: {
    title: "같이 공구",
    description: "공동 주문을 만들고 참여 현황을 확인하는 공간입니다.",
    example: "가상 주문 예시",
    cards: [
      { title: "오늘의 커피 주문", detail: "모집 중 · 마감 시간 설정" },
      { title: "주문 항목", detail: "아메리카노 · 라떼 · 차" },
      { title: "참여 현황", detail: "메뉴별 수량과 참여자를 한눈에 확인" },
    ],
  },
  games: {
    title: "우리 반 게임",
    description: "게임을 고르고 방을 만들어 함께 플레이하는 공간입니다.",
    example: "게임 화면 안내",
    cards: [
      { title: "뱅!", detail: "방을 만들고 참가자를 초대하는 카드 게임" },
      { title: "야구", detail: "혼자 연습하거나 친구와 대결" },
      { title: "실시간 게임방", detail: "참가자와 진행 상태를 확인" },
    ],
  },
  study: {
    title: "공부 문제",
    description: "주제별 문제를 풀고 풀이 기록과 오답을 관리하는 공간입니다.",
    example: "학습 화면 안내",
    cards: [
      { title: "Python", detail: "문법과 자료구조 문제" },
      { title: "Web", detail: "HTML · CSS · JavaScript 문제" },
      { title: "AI Python", detail: "AI 활용과 주차별 학습 문제" },
    ],
  },
  attendance: {
    title: "출결 서류",
    description: "확인서와 변경요청서를 작성하고 미리 보는 도구입니다.",
    example: "서류 구성 안내",
    cards: [
      { title: "서류 선택", detail: "확인서 또는 변경요청서" },
      { title: "내용 입력", detail: "날짜 · 사유 · 관련 정보" },
      { title: "미리보기", detail: "작성한 서류의 인쇄 형태 확인" },
    ],
  },
  gallery: {
    title: "우리 반 사진첩",
    description: "반 활동 사진을 모아 보고 댓글을 남기는 공간입니다.",
    example: "사진첩 구성 안내",
    cards: [
      { title: "앨범", detail: "활동별 사진 분류" },
      { title: "사진 보기", detail: "제목 · 촬영일 · 설명" },
      { title: "댓글", detail: "회원끼리 추억을 나누는 공간" },
    ],
  },
  "ground-rules": {
    title: "그라운드 룰",
    description: "함께 정한 약속을 확인하고 의견을 나누는 공간입니다.",
    example: "가상 규칙 예시",
    cards: [
      { title: "서로 존중하기", detail: "의견이 달라도 끝까지 듣기" },
      { title: "일정 공유하기", detail: "변경 사항을 미리 알리기" },
      { title: "함께 관리하기", detail: "규칙에 공감하고 의견 남기기" },
    ],
  },
  board: {
    title: "익명 게시판",
    description: "회원이 이름을 밝히지 않고 의견을 나누는 공간입니다.",
    example: "가상 게시글 예시",
    cards: [
      { title: "스터디 같이 하실 분?", detail: "예시 게시글 · 댓글로 이야기 나누기" },
      { title: "오늘의 질문", detail: "예시 게시글 · 자유롭게 의견 공유" },
      { title: "게시판 관리", detail: "회원 게시글과 댓글 관리" },
    ],
  },
  me: {
    title: "체험 계정",
    description: "지금은 체험 방문자로 둘러보고 있습니다.",
    example: "체험 정보",
    cards: [
      { title: "계정", detail: "체험 방문자" },
      { title: "접근 범위", detail: "사진첩 열람 · 문제 체험 · 나머지 메뉴 미리보기" },
      { title: "회원 기능", detail: "정식 계정으로 로그인하면 이용 가능" },
    ],
  },
};

function previewForPath(pathname: string): PreviewSection {
  const key = pathname.split("/")[1];
  return PREVIEWS[key] ?? PREVIEWS.me;
}

export default function DemoPreviewView({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const preview = previewForPath(pathname);

  const exitDemo = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
        <div className="flex items-center gap-2 font-semibold">
          <Eye className="h-4 w-4 shrink-0 text-[#1259AA]" />
          <span><b>체험 계정</b> · 사진첩과 학습 문제를 둘러보고 풀어볼 수 있습니다. 글·사진·댓글·풀이 기록은 저장되지 않습니다.</span>
        </div>
        <button type="button" onClick={() => void exitDemo()} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-[#1259AA] shadow-sm hover:bg-blue-100">
          <LogOut className="h-3.5 w-3.5" /> 정식 계정으로 로그인
        </button>
      </div>

      {children ?? (
        <>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1d3a] via-[#1259AA] to-[#3b82d0] px-6 py-9 text-white sm:px-9">
            <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/10 blur-xl" />
            <div className="relative max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold"><Sparkles className="h-3.5 w-3.5" /> READ ONLY PREVIEW</span>
              <h1 className="text-3xl font-black sm:text-4xl">{preview.title}</h1>
              <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">{preview.description}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-2 text-sm font-black text-gray-800"><LockKeyhole className="h-4 w-4 text-[#1259AA]" />{preview.example}</div>
            <div className="grid gap-3 md:grid-cols-3">
              {preview.cards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1259AA]/10 text-[#1259AA]"><Eye className="h-4 w-4" /></div>
                  <h2 className="font-extrabold text-gray-900">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{card.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
            <h2 className="text-lg font-black text-gray-900">다른 메뉴 둘러보기</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {NAV_ITEMS.filter((item) => item.path !== "/").map((item) => {
                const Icon = item.icon;
                return <Link key={item.path} to={item.path} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1259AA]"><Icon className="h-4 w-4" />{item.label}<ArrowRight className="ml-auto h-3.5 w-3.5" /></Link>;
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
