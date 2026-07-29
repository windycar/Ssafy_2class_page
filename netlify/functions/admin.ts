import { createClient } from "@supabase/supabase-js";

export default async (request: Request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const password = request.headers.get("x-admin-password");
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!expectedPassword || !supabaseUrl || !serviceKey) return new Response("Server configuration missing", { status: 500 });
  if (!password || password !== expectedPassword) return new Response("Unauthorized", { status: 401 });

  const body = await request.json() as { action?: string; id?: string; title?: string; content?: string; description?: string };
  if (body.action === "verify") return Response.json({ ok: true });

  const client = createClient(supabaseUrl, serviceKey);

  if (body.action === "bang.rooms.list") {
    const { data, error } = await client
      .from("bang_rooms")
      .select("id, room_data")
      .order("updated_at", { ascending: false });

    if (error) return new Response(error.message, { status: 400 });
    const rooms = (data ?? []).map((row) => ({
      ...(row.room_data as Record<string, unknown>),
      id: row.id,
    }));
    return Response.json({ ok: true, rooms });
  }

  let error = null;
  if (body.action === "gallery.update" && body.id) {
    ({ error } = await client.from("gallery_photos").update({ title: body.title, description: body.description }).eq("id", body.id));
  } else if (body.action === "gallery.delete" && body.id) {
    ({ error } = await client.from("gallery_photos").delete().eq("id", body.id));
  } else if (body.action === "board.update" && body.id) {
    ({ error } = await client.from("anonymous_posts").update({ title: body.title, content: body.content, updated_at: new Date().toISOString() }).eq("id", body.id));
  } else if (body.action === "board.delete" && body.id) {
    ({ error } = await client.from("anonymous_posts").delete().eq("id", body.id));
  } else if (body.action === "bang.room.delete" && body.id) {
    ({ error } = await client.from("bang_rooms").delete().eq("id", body.id));
  } else {
    return new Response("Unsupported action", { status: 400 });
  }

  return error ? new Response(error.message, { status: 400 }) : Response.json({ ok: true });
};
