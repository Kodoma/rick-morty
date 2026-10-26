import { Grid, Typography } from '@mui/material'
import type { Character } from '../schema'
import { CharacterCard } from './CharacterCard'

type Props = {
  characters: Character[]
  onSelect: (id: number) => void
}

export function CharacterGrid({ characters, onSelect }: Props) {
  if (characters.length === 0) {
    return (
      <Typography variant="h6" component="p" sx={{ mt: 2 }}>
        No se encontraron personajes.
      </Typography>
    )
  }

  return (
    <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {characters.map((character) => (
        <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} component="li">
          <CharacterCard character={character} onSelect={onSelect} />
        </Grid>
      ))}
    </Grid>
  )
}
