import { z } from 'zod';
import { createNote, listNotes } from '@/lib/notes';

const createNoteSchema = z.object({
  title: z.string().trim().min(1, 'Add a title.').max(120, 'Keep the title under 120 characters.'),
  description: z.string().max(10000, 'Keep the description under 10,000 characters.'),
});

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams.get('q') ?? '';
  if (search.length > 200) {
    return Response.json({ error: 'Search must be 200 characters or fewer.' }, { status: 400 });
  }
  return Response.json({ notes: await listNotes(search) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Enter a valid note.' }, { status: 400 });
  }
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Check the note details.' },
      { status: 400 }
    );
  }
  const note = await createNote(parsed.data);
  return Response.json({ note }, { status: 201 });
}
