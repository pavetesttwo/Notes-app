'use client';

import { useNotes } from '@/hooks/use-notes';
import { DeleteNoteDialog } from './delete-note-dialog';
import { NotesContent } from './notes-content';
import { NotesHeader } from './notes-header';
import { NoteEditor } from './note-editor';

export function NotesApp() {
  const {
    state,
    pinnedNotes,
    otherNotes,
    loadNotes,
    saveNote,
    togglePin,
    deleteNote,
    setQuery,
    openEditor,
    closeEditor,
    selectDelete,
  } = useNotes();

  return (
    <main
      id="main-content"
      className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12"
    >
      <NotesHeader
        query={state.query}
        notice={state.notice}
        error={state.error}
        onQueryChange={setQuery}
        onCreate={() => openEditor(null)}
        onRetry={() => loadNotes(state.query)}
      />
      <NotesContent
        notes={state.notes}
        loading={state.loading}
        searching={state.query.trim().length > 0}
        pinnedNotes={pinnedNotes}
        otherNotes={otherNotes}
        onCreate={() => openEditor(null)}
        onEdit={openEditor}
        onTogglePin={togglePin}
        onDelete={selectDelete}
      />
      <NoteEditor
        key={`${state.editingNote?.id ?? 'new'}-${state.editorOpen}`}
        note={state.editingNote}
        open={state.editorOpen}
        pending={state.pending}
        onClose={closeEditor}
        onSave={saveNote}
      />
      <DeleteNoteDialog
        key={state.deletingNote?.id ?? 'closed'}
        note={state.deletingNote}
        pending={state.pending}
        onClose={() => selectDelete(null)}
        onDelete={deleteNote}
      />
    </main>
  );
}
