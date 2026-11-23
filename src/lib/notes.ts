import { randomUUID } from 'node:crypto';
import { desc, eq, like, or } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { Note } from '@/db/schema';

export const MAX_NOTES_PER_REQUEST = 500;

export async function listNotes(search = ''): Promise<Note[]> {
  const query = search.trim();
  const filter = query
    ? or(like(schema.notes.title, `%${query}%`), like(schema.notes.description, `%${query}%`))
    : undefined;
  return db
    .select()
    .from(schema.notes)
    .where(filter)
    .orderBy(desc(schema.notes.pinned), desc(schema.notes.updatedAt))
    .limit(MAX_NOTES_PER_REQUEST);
}

export async function createNote(input: { title: string; description: string }): Promise<Note> {
  const timestamp = new Date().toISOString();
  const note: Note = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    pinned: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.insert(schema.notes).values(note);
  return note;
}

export async function updateNote(
  id: string,
  input: { title?: string; description?: string; pinned?: boolean }
): Promise<Note | undefined> {
  const [note] = await db
    .update(schema.notes)
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(schema.notes.id, id))
    .returning();
  return note;
}

export async function deleteNote(id: string): Promise<boolean> {
  const [deleted] = await db
    .delete(schema.notes)
    .where(eq(schema.notes.id, id))
    .returning({ id: schema.notes.id });
  return Boolean(deleted);
}
