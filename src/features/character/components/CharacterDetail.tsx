import { Alert, Button, Chip, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useCharacterById, useEdits, useSaveEdit } from '../query'
import { applyEdit } from '../schema'
import { CharacterCard } from './CharacterCard'
import { CharacterForm } from './CharacterForm'

type Props = { id: number; onBack: () => void }

export function CharacterDetail({ id, onBack }: Props) {
  // Ver o editar: un estado local alcanza, no hace falta una ruta.
  const [isEditing, setIsEditing] = useState(false)
  const { isPending, isError, data: character, error } = useCharacterById(id)
  const { data: edits, isPending: editsPending } = useEdits()
  const save = useSaveEdit()

  const edit = edits?.find((e) => e.characterId === id)

  // Esperamos también a las ediciones. Si no, al editar antes de que carguen,
  // `edit` es undefined y se crea un duplicado (POST en vez de PUT).
  if (isPending || editsPending) {
    return (
      <Typography variant="h6" component="p" sx={{ mt: 2 }}>
        Cargando personaje...
      </Typography>
    )
  }
  if (isError) return <Alert severity="error">{error.message}</Alert>

  // La misma función que usa la lista: la edición local pisa los datos de la API.
  const shown = applyEdit(character, edit)

  return (
    <Stack spacing={2} sx={{ maxWidth: 480, mx: 'auto' }}>
      <Button onClick={onBack} sx={{ alignSelf: 'flex-start' }}>
        ← Volver
      </Button>

      {isEditing ? (
        <>
          {save.isError && <Alert severity="error">{save.error.message}</Alert>}
          <CharacterForm
            defaultValues={{
              name: shown.name,
              status: shown.status,
              species: shown.species,
              type: shown.type,
              gender: shown.gender,
            }}
            onSubmit={async (values) => {
              try {
                await save.mutateAsync({ characterId: id, values, existingId: edit?.id })
                setIsEditing(false)
              } catch {
                // No hacemos nada: el error ya se muestra arriba con save.error.
                // Sin este catch, RHF vuelve a lanzar el error y queda como promesa sin manejar.
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <>
          <CharacterCard character={shown} />
          <Typography variant="body2" color="text.secondary">
            {shown.gender}
            {shown.type ? ` - ${shown.type}` : ''}
          </Typography>
          {edit && (
            <Chip
              label={`Editado localmente · ${new Date(edit.updatedAt).toLocaleString()}`}
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        </>
      )}
    </Stack>
  )
}
