'use client';

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { readError } from '@/lib/client-error';
import type { Note } from '@/db/schema';

type NotesState = {
  notes: Note[];
  query: string;
  loading: boolean;
  pending: boolean;
  error: string;
  notice: string;
  editorOpen: boolean;
  editingNote: Note | null;
  deletingNote: Note | null;
};

type NotesAction =
  | { type: 'loaded'; notes: Note[] }
  | { type: 'query-changed'; query: string }
  | { type: 'loading-failed'; error: string }
  | { type: 'clear-error' }
  | { type: 'pending-changed'; pending: boolean }
  | { type: 'notice-changed'; notice: string }
  | { type: 'editor-opened'; note: Note | null }
  | { type: 'editor-closed' }
  | { type: 'deleting-note-changed'; note: Note | null };

const initialState: NotesState = {
  notes: [],
  query: '',
  loading: true,
  pending: false,
  error: '',
  notice: '',
  editorOpen: false,
  editingNote: null,
  deletingNote: null,
};

function reducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'loaded':
      return { ...state, notes: action.notes, loading: false };
    case 'query-changed':
      return { ...state, query: action.query };
    case 'loading-failed':
      return { ...state, error: action.error, loading: false };
    case 'clear-error':
      return { ...state, error: '' };
    case 'pending-changed':
      return { ...state, pending: action.pending };
    case 'notice-changed':
      return { ...state, notice: action.notice };
    case 'editor-opened':
      return { ...state, editorOpen: true, editingNote: action.note, notice: '' };
    case 'editor-closed':
      return { ...state, editorOpen: false };
    case 'deleting-note-changed':
      return { ...state, deletingNote: action.note };
    default:
      return state;
  }
}

export function useNotes() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadNotes = useCallback(async (search: string, signal?: AbortSignal) => {
    dispatch({ type: 'clear-error' });
    try {
      const response = await fetch(`/api/notes?q=${encodeURIComponent(search)}`, { signal });
      if (!response.ok) throw new Error(await readError(response));
      const data: { notes: Note[] } = await response.json();
      dispatch({ type: 'loaded', notes: data.notes });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      dispatch({
        type: 'loading-failed',
        error: cause instanceof Error ? cause.message : 'Your notes could not be loaded.',
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => loadNotes(state.query, controller.signal), 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadNotes, state.query]);

  const pinnedNotes = useMemo(() => state.notes.filter((note) => note.pinned), [state.notes]);
  const otherNotes = useMemo(() => state.notes.filter((note) => !note.pinned), [state.notes]);

  async function saveNote(values: { title: string; description: string }) {
    dispatch({ type: 'pending-changed', pending: true });
    dispatch({ type: 'clear-error' });
    try {
      const response = await fetch(
        state.editingNote ? `/api/notes/${state.editingNote.id}` : '/api/notes',
        {
          method: state.editingNote ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error(await readError(response));
      dispatch({ type: 'editor-closed' });
      dispatch({
        type: 'notice-changed',
        notice: state.editingNote ? 'Note updated.' : 'Note created.',
      });
      await loadNotes(state.query);
    } finally {
      dispatch({ type: 'pending-changed', pending: false });
    }
  }

  async function togglePin(note: Note) {
    dispatch({ type: 'pending-changed', pending: true });
    dispatch({ type: 'clear-error' });
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !note.pinned }),
      });
      if (!response.ok) throw new Error(await readError(response));
      dispatch({ type: 'notice-changed', notice: note.pinned ? 'Note unpinned.' : 'Note pinned.' });
      await loadNotes(state.query);
    } catch (cause) {
      dispatch({
        type: 'loading-failed',
        error: cause instanceof Error ? cause.message : 'The note could not be updated.',
      });
    } finally {
      dispatch({ type: 'pending-changed', pending: false });
    }
  }

  async function deleteNote(note: Note) {
    dispatch({ type: 'pending-changed', pending: true });
    try {
      const response = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await readError(response));
      dispatch({ type: 'deleting-note-changed', note: null });
      dispatch({ type: 'notice-changed', notice: 'Note deleted.' });
      await loadNotes(state.query);
    } finally {
      dispatch({ type: 'pending-changed', pending: false });
    }
  }

  return {
    state,
    pinnedNotes,
    otherNotes,
    loadNotes,
    saveNote,
    togglePin,
    deleteNote,
    setQuery: (query: string) => dispatch({ type: 'query-changed', query }),
    openEditor: (note: Note | null) => dispatch({ type: 'editor-opened', note }),
    closeEditor: () => dispatch({ type: 'editor-closed' }),
    selectDelete: (note: Note | null) => dispatch({ type: 'deleting-note-changed', note }),
  };
}
