import { requireSupabase } from "../lib/supabase";

export const CHRISTMAS_NOTE_LIMIT = 140;
export const CHRISTMAS_NOTES_PER_MEMBER = 2;

export type ChristmasNote = {
  id: string;
  content: string;
  author_name: string | null;
  is_sample?: boolean;
};

export type OrnamentKind = "star" | "bell" | "snowflake" | "bauble" | "candy" | "ribbon" | "gift" | "gingerbread" | "custom";
export type OrnamentSlot = 1 | 2;
export type OrnamentPosition = { height: number; azimuth: number };
export type OrnamentDesign = { kind: OrnamentKind; image_data: string | null };
export type SceneOrnament = OrnamentDesign & { id: string; height: number | null; azimuth: number | null };

export type ChristmasOrnament = SceneOrnament & { own_slot: OrnamentSlot | null };

type OrnamentChange =
  | { slot: OrnamentSlot; design: OrnamentDesign; position?: OrnamentPosition }
  | { slot: OrnamentSlot; remove: true };

export async function manageChristmasTreeOrnaments(change?: OrnamentChange, signal?: AbortSignal) {
  const design = change && "design" in change ? change.design : null;
  const position = change && "position" in change ? change.position : undefined;
  const request = requireSupabase().rpc("manage_my_christmas_tree_ornament_images", {
    p_slot: change?.slot ?? null,
    p_kind: design?.kind ?? null,
    p_height: position?.height ?? null,
    p_azimuth: position?.azimuth ?? null,
    p_remove: Boolean(change && "remove" in change),
    p_image: design?.image_data ?? null,
  });
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
