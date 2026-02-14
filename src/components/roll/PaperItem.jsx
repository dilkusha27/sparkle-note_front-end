import { useMemo } from 'react'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'

const COLORS = [
  'rgba(215, 238, 137, 0.5)',
  'rgba(187, 219, 180, 0.5)',
  'rgba(255, 167, 160, 0.5)',
  'rgba(252, 240, 204, 0.5)',
  'rgba(166, 227, 255, 0.5)',
]

const getSeed = (value) => {
  if (!value) return 0
  const str = String(value)
  return Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

export default function PaperItem({ paper, onOpenDetail }) {
  const paperId = paper?.paperId ?? paper?.id ?? ''
  const authorName = paper?.authorName ?? '익명'
  const authorRole = paper?.authorRole ?? ''
  const content = paper?.content ?? ''

  const { rotation, backgroundColor } = useMemo(() => {
    const seed = getSeed(paperId)
    return {
      rotation: (seed % 11) - 5,
      backgroundColor: COLORS[seed % COLORS.length],
    }
  }, [paperId])

  const displayAuthor = authorRole === 'TEACHER' ? '선생님' : authorName

  return (
    <Card
      sx={{
        width: 220,
        minHeight: 180,
        transform: `rotate(${rotation}deg)`,
        backgroundColor,
      }}
    >
      <CardActionArea onClick={() => onOpenDetail?.(paper)} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            From. {displayAuthor}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
