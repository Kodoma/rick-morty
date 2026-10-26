import { zodResolver } from '@hookform/resolvers/zod'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import {
  CHARACTER_GENDERS,
  CHARACTER_STATUSES,
  CharacterFormSchema,
  type CharacterFormValues,
} from '../schema'

type Props = {
  defaultValues: CharacterFormValues
  onSubmit: (values: CharacterFormValues) => Promise<unknown>
  onCancel: () => void
}

export function CharacterForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<CharacterFormValues>({
    defaultValues,
    resolver: zodResolver(CharacterFormSchema),
    mode: 'onTouched',
  })

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nombre"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Estado"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          >
            {CHARACTER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        control={control}
        name="species"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Especie"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Tipo"
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? 'Opcional'}
          />
        )}
      />
      <Controller
        control={control}
        name="gender"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Género"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          >
            {CHARACTER_GENDERS.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          Guardar
        </Button>
      </Stack>
    </Stack>
  )
}
