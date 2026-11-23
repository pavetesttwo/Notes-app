import { z } from 'zod';
import { deleteNote, updateNote } from '@/lib/notes';

const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Add a title.')
      .max(120, 'Keep the title under 120 characters.')
      .optional(),
    description: z.string().max(10000, 'Keep the description under 10,000 characters.').optional(),
    pinned: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'Change at least one note field.');
const noteIdSchema = z.string().uuid();

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!noteIdSchema.safeParse(id).success) {
    return Response.json({ error: 'This note could not be found.' }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Enter valid note details.' }, { status: 400 });
  }
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Check the note details.' },
      { status: 400 }
    );
  }
  const note = await updateNote(id, parsed.data);
  if (!note) return Response.json({ error: 'This note could not be found.' }, { status: 404 });
  return Response.json({ note });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!noteIdSchema.safeParse(id).success || !(await deleteNote(id))) {
    return Response.json({ error: 'This note could not be found.' }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
