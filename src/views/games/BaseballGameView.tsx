import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, ChevronRight, Sparkles, Users, Zap } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import baseballArena from "../../assets/games/baseball-arena-facing.png";
import { GameAssetPreloader } from "../../components/games/baseball/v2/GameAssetPreloader";
import { BaseballOnlineGameV2 } from "../../components/games/baseball/v2/BaseballOnlineGameV2";
import { BaseballSoloGameV2 } from "../../components/games/baseball/v2/BaseballSoloGameV2";
import { useAuth } from "../../hooks/useAuth";
import {
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  baseballRoomCommandClient,
} from "../../services/baseballRoomCommandClient.ts";
import { baseballRoomStorage } from "../../services/storage/baseballRoomStorage";
import type { BaseballRoom } from "../../types/baseballRoom";
import { canRenderBaseballOnlineRoom } from "../../utils/games/baseball/onlineRoomAccess.ts";
import "../../styles/baseball.css";

function BaseballModeMenu({ onStartSolo }: { onStartSolo: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="baseball-page">
      <Link to="/games" className="baseball-back-link"><ArrowLeft aria-hidden="true" /> 게임방으로</Link>

      <section className="baseball-menu-hero">
        <img src={baseballArena} alt="투수와 타자가 승부하는 야구장" />
        <div className="baseball-menu-shade" />
        <div className="baseball-menu-copy">
          <span className="baseball-kicker"><Sparkles aria-hidden="true" /> GWANGJU 2 CLASS</span>
          <h1>광주 2반<br /><strong>BASEBALL</strong></h1>
          <p>타격과 투구를 직접 조작하는 3이닝 야구 경기</p>
        </div>
      </section>

      <section className="baseball-mode-section" aria-labelledby="mode-heading">
        <div>
          <p className="baseball-section-eyebrow">PLAY MODE</p>
          <h2 id="mode-heading">경기 방식을 선택하세요</h2>
        </div>

        <div className="baseball-mode-grid">
          <button type="button" className="baseball-mode-card is-solo" onClick={onStartSolo}>
            <span className="baseball-mode-icon"><Bot aria-hidden="true" /></span>
            <span><small>CPU와 실제 공수 교대</small><strong>1인 경기</strong><em>공격은 타격 · 수비는 투구 조작</em></span>
            <ChevronRight aria-hidden="true" />
          </button>

          <button type="button" className="baseball-mode-card is-versus" onClick={() => navigate("/games/baseball/rooms")}>
            <span className="baseball-mode-icon"><Users aria-hidden="true" /></span>
            <span><small>게임방을 만들고 친구 초대</small><strong>온라인 2인 대결</strong><em>참여와 준비 완료 후 방장이 시작</em></span>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="baseball-how-to">
          <Zap aria-hidden="true" />
          <p><strong>실제 야구 규칙</strong> 4볼은 볼넷, 3스트라이크는 삼진, 3아웃마다 공수 교대합니다. 3회 종료 동점이면 연장전에 들어갑니다.</p>
        </div>
      </section>
    </div>
  );
}

export default function BaseballGameView() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [showSolo, setShowSolo] = useState(false);
  const [onlineRoom, setOnlineRoom] = useState<BaseballRoom | null>(() => (
    roomId ? baseballRoomStorage.getRoom(roomId) : null
  ));
  const [isOnlineRoomLoading, setIsOnlineRoomLoading] = useState(Boolean(roomId && !onlineRoom));
  const roomRef = useRef(onlineRoom);
  const leaveInFlightRef = useRef(false);

  useEffect(() => {
    if (!roomId) {
      roomRef.current = null;
      setOnlineRoom(null);
      setIsOnlineRoomLoading(false);
      return;
    }

    let active = true;
    const cachedRoom = baseballRoomStorage.getRoom(roomId);
    roomRef.current = cachedRoom;
    setOnlineRoom(cachedRoom);
    setIsOnlineRoomLoading(!cachedRoom);

    void baseballRoomStorage.refreshRoom(roomId)
      .then((canonicalRoom) => {
        if (!active) return;
        roomRef.current = canonicalRoom;
        setOnlineRoom(canonicalRoom);
      })
      .finally(() => {
        if (active) setIsOnlineRoomLoading(false);
      });

    return () => {
      active = false;
    };
  }, [roomId]);

  const leaveOnlineRoom = useCallback(async () => {
    const activeRoom = roomRef.current;
    if (!activeRoom || leaveInFlightRef.current) return false;

    leaveInFlightRef.current = true;
    try {
      const sessionId = baseballRoomCommandClient.getSessionId();
      const commandId = baseballRoomCommandClient.createCommandId("LEAVE");
      const sendAtRevision = (expectedRevision: number) => baseballRoomCommandClient.send({
        schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
        commandId,
        kind: "LEAVE",
        roomId: activeRoom.id,
        expectedRevision,
        payload: { sessionId },
      });

      let result = await sendAtRevision(activeRoom.revision);
      if (!result.ok && result.status === 409 && result.room) {
        roomRef.current = result.room;
        setOnlineRoom(result.room);
        baseballRoomStorage.cacheCanonicalRoom(result.room);
        result = await sendAtRevision(result.room.revision);
      }
      if (result.room) {
        roomRef.current = result.room;
        setOnlineRoom(result.room);
        baseballRoomStorage.cacheCanonicalRoom(result.room);
      } else if (result.ok && result.deleted) {
        baseballRoomStorage.deleteCachedRoom(activeRoom.id);
        roomRef.current = null;
        setOnlineRoom(null);
      }

      if (!result.ok) {
        toast.error(result.status === 0
          ? "네트워크 연결을 확인한 뒤 다시 시도해 주세요."
          : "게임방에서 나가지 못했습니다. 다시 시도해 주세요.");
        return false;
      }
      return true;
    } finally {
      leaveInFlightRef.current = false;
    }
  }, []);

  const exitOnlineGame = useCallback(() => {
    void leaveOnlineRoom().then((left) => {
      if (left) navigate("/games/baseball/rooms");
    });
  }, [leaveOnlineRoom, navigate]);

  if (!roomId) {
    if (showSolo) {
      return (
        <GameAssetPreloader>
          <div className="baseball-page">
            <BaseballSoloGameV2
              playerName={currentUser?.name ?? "1P"}
              onExit={() => setShowSolo(false)}
            />
          </div>
        </GameAssetPreloader>
      );
    }
    return <BaseballModeMenu onStartSolo={() => setShowSolo(true)} />;
  }

  if (isAuthLoading || isOnlineRoomLoading) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" /></div>;
  }

  if (!onlineRoom) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-4xl">⚾</span>
        <p className="text-sm font-bold text-gray-400">야구 게임방을 찾을 수 없습니다.</p>
        <Link to="/games/baseball/rooms" className="text-sm font-semibold text-blue-700 underline">야구 게임방 목록으로</Link>
      </div>
    );
  }

  if (!currentUser || !canRenderBaseballOnlineRoom(onlineRoom, currentUser.authId)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="text-4xl">⚾</span>
        <p className="text-sm font-bold text-gray-500">두 명의 인증된 참가자가 함께 시작한 경기만 입장할 수 있습니다.</p>
        <Link to={`/games/baseball/rooms/${onlineRoom.id}`} className="text-sm font-semibold text-blue-700 underline">야구 게임방으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <GameAssetPreloader>
      <div className="baseball-page">
        <BaseballOnlineGameV2
          room={onlineRoom}
          currentAuthId={currentUser.authId}
          onExit={exitOnlineGame}
        />
      </div>
    </GameAssetPreloader>
  );
}
