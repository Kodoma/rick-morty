import {
  Alert,
  CircularProgress,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useDebouncedValue } from '../../../lib/useDebouncedValue'
import { useCharacterList, useEdits } from '../query'
import { applyEdit, CHARACTER_STATUSES, type CharacterFilters } from '../schema'
import { CharacterGrid } from './CharacterGrid'

type SearchForm = Pick<CharacterFilters, 'name' | 'status'>

export function CharacterList({ onSelect }: { onSelect: (id: number) => void }) {
  // Los filtros también pasan por react-hook-form: el enunciado dice "every input".
  const { control } = useForm<SearchForm>({ defaultValues: { name: '', status: '' } })
  const name = useWatch({ control, name: 'name' })
  const status = useWatch({ control, name: 'status' })
  // Buscamos recién cuando el usuario deja de tipear 400 ms.
  const debouncedName = useDebouncedValue(name.trim(), 400)

  // La página "pertenece" a una búsqueda. Guardamos las dos juntas: si la búsqueda cambió,
  // la página vuelve a 1 sin useEffect (un useEffect pediría primero "página 3 de morty").
  const search = `${debouncedName}|${status}`
  const [pagination, setPagination] = useState({ search, page: 1 })
  const page = pagination.search === search ? pagination.page : 1

  const { isPending, isError, error, data, isPlaceholderData } = useCharacterList({
    page,
    name: debouncedName,
    status,
  })

  // Las ediciones guardadas en json-server. Es la misma query que usa el detalle,
  // así que al guardar una edición (invalidateQueries) la lista también se actualiza sola.
  const { data: edits } = useEdits()

  return (
    <Stack spacing={2}>
      <Stack
        component="form"
        role="search"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        onSubmit={(event) => event.preventDefault()}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField {...field} label="Buscar por nombre" type="search" fullWidth />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <TextField {...field} select label="Estado" sx={{ minWidth: 180 }}>
              <MenuItem value="">Todos</MenuItem>
              {CHARACTER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>

      {isPending ? (
        <CircularProgress sx={{ alignSelf: 'center' }} />
      ) : isError ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        // Después de los dos chequeos de arriba, TypeScript ya sabe que `data` existe.
        <>
          {/* keepPreviousData: mientras carga la página nueva, la anterior se ve atenuada. */}
          <Stack sx={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
            <CharacterGrid
              characters={data.results.map((character) =>
                applyEdit(
                  character,
                  edits?.find((e) => e.characterId === character.id),
                ),
              )}
              onSelect={onSelect}
            />
          </Stack>
          {data.info.pages > 1 && (
            <Pagination
              sx={{ alignSelf: 'center' }}
              count={data.info.pages}
              page={page}
              onChange={(_event, newPage) => setPagination({ search, page: newPage })}
            />
          )}
          {data.info.count > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {data.info.count} personajes
            </Typography>
          )}
        </>
      )}
    </Stack>
  )
}
