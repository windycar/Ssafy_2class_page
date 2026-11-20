import { requireSupabase } from "../lib/supabase";

export const CHRISTMAS_NOTE_LIMIT = 140;
export const CHRISTMAS_NOTES_PER_MEMBER = 2;

export type ChristmasNote = {
  id: string;
  content: string;
  author_name: string | null;
  is_sample?: boolean;
};

export type OrnamentKind = "star" | "bell" | "snowflake" | "bauble";

export type ChristmasOrnament = {
  id: string;
  kind: OrnamentKind;
  is_mine: boolean;
};

export async function manageChristmasTreeOrnament(kind: OrnamentKind | null, remove = false, signal?: AbortSignal) {
  const request = requireSupabase().rpc("manage_my_christmas_tree_ornament", { p_kind: kind, p_remove: remove });
  const { data, error } = await (signal ? request.abortSignal(signal) : request);
  if (error) throw error;
  return data as ChristmasOrnament[];
}

export async function getChristmasTreeNotes(signal: AbortSignal) {
  const client = requireSupabase();
  const [notes, ownNotes] = await Promise.all([
    client
      .from("christmas_tree_notes")
      .select("id, content, author_name, is_sample")
      .order("is_sample", { ascending: true })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .abortSignal(signal),
    client.rpc("list_my_christmas_tree_notes").abortSignal(signal),
  ]);

  if (notes.error) throw notes.error;
  if (ownNotes.error) throw ownNotes.error;

  return { notes: notes.data as ChristmasNote[], ownNotes: ownNotes.data as ChristmasNote[] };
}

export async function saveChristmasTreeNote(noteId: string, content: string, showName: boolean, editing: boolean) {
  const { data, error } = await requireSupabase()
    .rpc("save_my_christmas_tree_note", {
      p_note_id: noteId,
      p_content: content,
      p_show_name: showName,
      p_edit: editing,
    })
    .single();
  if (error?.message === "christmas_tree_note_limit") return { status: "full" } as const;
  if (error?.message === "own note required") return { status: "missing" } as const;
  if (error) throw error;
  return { status: "saved", note: data as ChristmasNote } as const;
}

export async function deleteChristmasTreeNote(noteId: string) {
  const { data, error } = await requireSupabase().rpc("delete_my_christmas_tree_note", { p_note_id: noteId });
  if (error) throw error;
  return data === true;
}
