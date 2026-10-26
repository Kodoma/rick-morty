import { z } from 'zod'
import { type CharacterEdit, CharacterEditsSchema, type CharacterFormValues } from './schema'

// ── json-server (lectura/escritura) ───────────────────────────────
const LOCAL_API = import.meta.env.VITE_LOCAL_API_URL ?? 'http://localhost:3001'

export async function fetchEdits(signal?: AbortSignal): Promise<CharacterEdit[]> {
  const res = await fetch(`${LOCAL_API}/edits`, { signal })
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return z.array(CharacterEditsSchema).parse(await res.json())
}

/** POST si es nueva, PUT si ya existía. json-server 1.x ignora el id que le mandamos,
 *  por eso el personaje va en `characterId`. */
export async function saveEdit(
  characterId: number,
  values: CharacterFormValues,
  existingId?: string,
): Promise<CharacterEdit> {
  const res = await fetch(existingId ? `${LOCAL_API}/edits/${existingId}` : `${LOCAL_API}/edits`, {
    method: existingId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, characterId, updatedAt: new Date().toISOString() }),
  })
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return CharacterEditsSchema.parse(await res.json())
}
