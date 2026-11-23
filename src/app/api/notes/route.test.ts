import assert from 'node:assert/strict';
import { test } from 'node:test';

function jsonRequest(method: string, body: unknown, url = 'http://localhost/api/notes') {
  return new Request(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('notes CRUD persists, searches, pins, and validates data', async () => {
  process.env.DATABASE_URL = ':memory:';
  const collection = await import('./route');
  const item = await import('./[id]/route');
  const invalidResponse = await collection.POST(
    jsonRequest('POST', { title: '  ', description: '' })
  );
  assert.equal(invalidResponse.status, 400);

  const createResponse = await collection.POST(
    jsonRequest('POST', { title: 'Research plan', description: 'Compare SQLite options' })
  );
  assert.equal(createResponse.status, 201);
  const { note: created } = (await createResponse.json()) as {
    note: { id: string; pinned: boolean };
  };
  assert.equal(created.pinned, false);

  const searchResponse = await collection.GET(new Request('http://localhost/api/notes?q=SQLite'));
  const searchResult = (await searchResponse.json()) as { notes: Array<{ id: string }> };
  assert.deepEqual(
    searchResult.notes.map((note) => note.id),
    [created.id]
  );

  const pinResponse = await item.PATCH(
    jsonRequest('PATCH', { pinned: true }, `http://localhost/api/notes/${created.id}`),
    { params: Promise.resolve({ id: created.id }) }
  );
  assert.equal(pinResponse.status, 200);
  const { note: pinned } = (await pinResponse.json()) as { note: { pinned: boolean } };
  assert.equal(pinned.pinned, true);

  const editResponse = await item.PATCH(
    jsonRequest('PATCH', { title: 'Updated research' }, `http://localhost/api/notes/${created.id}`),
    { params: Promise.resolve({ id: created.id }) }
  );
  const { note: edited } = (await editResponse.json()) as {
    note: { title: string; pinned: boolean };
  };
  assert.equal(edited.title, 'Updated research');
  assert.equal(edited.pinned, true);

  const deleteResponse = await item.DELETE(
    new Request(`http://localhost/api/notes/${created.id}`, { method: 'DELETE' }),
    { params: Promise.resolve({ id: created.id }) }
  );
  assert.equal(deleteResponse.status, 204);
  const missingResponse = await item.DELETE(
    new Request(`http://localhost/api/notes/${created.id}`, { method: 'DELETE' }),
    { params: Promise.resolve({ id: created.id }) }
  );
  assert.equal(missingResponse.status, 404);
});
