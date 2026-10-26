import z from 'zod'

export const CHARACTER_STATUSES = ['Alive', 'Dead', 'unknown'] as const
export const CHARACTER_GENDERS = ['Female', 'Male', 'Genderless', 'unknown'] as const

export type CharacterStatus = (typeof CHARACTER_STATUSES)[number]

/** Lo que se le pide a la API para listar. Vive en el estado de CharacterList. */
export type CharacterFilters = {
  page: number
  name: string
  status: CharacterStatus | ''
}

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(CHARACTER_STATUSES),
  species: z.string(),
  type: z.string(),
  gender: z.enum(CHARACTER_GENDERS),
  image: z.string().url(),
})

export const CharacterPageSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
  }),
  results: z.array(CharacterSchema),
})
export type CharacterPage = z.infer<typeof CharacterPageSchema>

export type Character = z.infer<typeof CharacterSchema>

// ── Formulario de edición ─────────────────────────────────────────

export const CharacterFormSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  status: z.enum(CHARACTER_STATUSES, { error: 'Elegí un estado' }),
  species: z.string().trim().min(1, 'La especie es obligatoria').max(40),
  type: z.string().trim().max(60, 'Máximo 60 caracteres'),
  gender: z.enum(CHARACTER_GENDERS, { error: 'Elegí un género' }),
})

export type CharacterFormValues = z.infer<typeof CharacterFormSchema>

/** json-server 0.x genera ids numéricos y 1.x strings: normalizamos a string. */
const EntityIdSchema = z.union([z.string(), z.number()]).transform(String)

export const CharacterEditsSchema = CharacterFormSchema.extend({
  id: EntityIdSchema,
  characterId: z.number().int().positive(),
  updatedAt: z.string(),
})

export type CharacterEdit = z.infer<typeof CharacterEditsSchema>

/**
 * Pantalla = datos de la API + edición local encima.
 * Solo pisamos los campos editables; el id sigue siendo el del personaje (el de json-server es otro).
 */
export function applyEdit(character: Character, edit?: CharacterEdit): Character {
  if (!edit) return character
  const { name, status, species, type, gender } = edit
  return { ...character, name, status, species, type, gender }
}
