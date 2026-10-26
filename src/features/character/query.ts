import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { fetchCharacterById, fetchCharacterPage } from './api'
import { fetchEdits, saveEdit } from './localApi'
import type { CharacterFilters, CharacterFormValues } from './schema'

export function useCharacterList(filters: CharacterFilters) {
  return useQuery({
    queryKey: ['characters', filters],
    // TanStack Query nos da un signal: si la query deja de importar (por ejemplo, el
    // usuario siguió tipeando), cancela el fetch en curso.
    queryFn: ({ signal }) => fetchCharacterPage(filters, signal),
    placeholderData: keepPreviousData,
  })
}

export function useCharacterById(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: ({ signal }) => fetchCharacterById(id, signal),
  })
}

export const localKeys = {
  edits: ['edits'] as const,
}

const editsQuery = queryOptions({
  queryKey: localKeys.edits,
  queryFn: ({ signal }) => fetchEdits(signal),
})

export function useEdits() {
  return useQuery(editsQuery)
}

type SaveEditVariables = {
  characterId: number
  values: CharacterFormValues
  existingId?: string
}

export function useSaveEdit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ characterId, values, existingId }: SaveEditVariables) =>
      saveEdit(characterId, values, existingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: localKeys.edits }),
  })
}
