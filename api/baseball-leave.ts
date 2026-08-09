import { createClient } from "@supabase/supabase-js";

import type { BaseballRoom } from "../src/types/baseballRoom";
import { removeBaseballPlayer } from "../src/utils/games/baseballRoomMembership";

type LeaveRequest = {
  roomId?: string;
  studentId?: number;
  sessionId?: string;
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function handleLeave(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return new Response("Server configuration missing", { status: 500 });
  }

  let body: LeaveRequest;
  try {
    body = await request.json() as LeaveRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const studentId = body.studentId;
  if (
    !body.roomId
    || !body.roomId.startsWith("baseball-")
    || typeof studentId !== "number"
    || !Number.isInteger(studentId)
    || !body.sessionId
  ) {
    return new Response("Invalid leave request", { status: 400 });
  }

  // A freshly reloaded page registers a new session before this delayed request runs.
  await wait(1200);

  const client = createClient(supabaseUrl, serviceKey);
  const { data, error } = await client
    .from("bang_rooms")
    .select("room_data")
    .eq("id", body.roomId)
    .maybeSingle();

  if (error) return new Response(error.message, { status: 400 });
  if (!data) return Response.json({ ok: true, alreadyGone: true });

  const room = data.room_data as BaseballRoom;
  const player = room.players.find((item) => item.studentId === studentId);
  if (!player || player.sessionId !== body.sessionId) {
    return Response.json({ ok: true, staleSession: true });
  }

  const updated = removeBaseballPlayer(room, studentId, "페이지를 닫아 자동 퇴장했습니다.");
  if (!updated) {
    const { error: deleteError } = await client
      .from("bang_rooms")
      .delete()
      .eq("id", body.roomId);
    return deleteError
      ? new Response(deleteError.message, { status: 400 })
      : Response.json({ ok: true, deleted: true });
  }

  const { error: updateError } = await client
    .from("bang_rooms")
    .update({
      room_data: updated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.roomId);

  return updateError
    ? new Response(updateError.message, { status: 400 })
    : Response.json({ ok: true });
}

export default {
  fetch: handleLeave,
};
