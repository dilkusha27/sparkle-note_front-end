import { Box, Typography } from '@mui/material'
import imageLogo from '../assets/images/logo/image_logo.png'

export default function HomePage() {
  return (
    <Box sx={{ display: 'grid', gap: 2, justifyItems: 'start' }}>
      <Box
        component="img"
        src={imageLogo}
        alt="Sparkle Note"
        sx={{ width: 160, height: 'auto' }}
      />
      <Typography variant="h4">Home (placeholder)</Typography>
    </Box>
  )
}

