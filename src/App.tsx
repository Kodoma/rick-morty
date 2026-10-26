import { Box, Container, Typography } from '@mui/material'
import { useState } from 'react'
import { CharacterDetail } from './features/character/components/CharacterDetail'
import { CharacterList } from './features/character/components/CharacterList'

function App() {
  // Navegación mínima: un estado dice qué personaje está abierto.
  // Trade-off: sin URL, el refresh y el botón atrás del navegador no la conservan.
  // Para decir en voz alta: "en producción pondría el id y los filtros en la URL".
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Personajes
      </Typography>

      {/* La lista queda montada pero oculta: al volver del detalle conserva la búsqueda y la página. */}
      <Box hidden={selectedId !== null}>
        <CharacterList onSelect={setSelectedId} />
      </Box>

      {selectedId !== null && (
        // key: si cambia el personaje, el detalle arranca de cero (por ejemplo, sale del modo edición).
        <CharacterDetail key={selectedId} id={selectedId} onBack={() => setSelectedId(null)} />
      )}
    </Container>
  )
}

export default App
