import { Box, Button, Stack, Typography } from '@mui/material'

export default function RollItem({ roll, onEnter, onCopyUrl, onEdit, onDelete }) {
  const rollName = roll?.rollName ?? roll?.name ?? '이름 없음'
  const classCode = roll?.classCode ?? roll?.code ?? ''

  const handleClick = () => {
    onEnter?.(roll)
  }

  const handleAction = (handler) => (event) => {
    event.stopPropagation()
    handler?.(roll)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.08)' },
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">{rollName}</Typography>
        {classCode ? (
          <Typography color="text.secondary">학급코드: {classCode}</Typography>
        ) : null}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button size="small" variant="outlined" onClick={handleAction(onCopyUrl)}>
            URL 복사
          </Button>
          <Button size="small" variant="outlined" onClick={handleAction(onEdit)}>
            수정
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={handleAction(onDelete)}>
            삭제
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
