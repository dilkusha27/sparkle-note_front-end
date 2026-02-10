import { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { apiClient } from '../shared/api/apiClient.js'
import { isAppError } from '../shared/error/AppError.js'
import { toUserMessage } from '../shared/error/toUserMessage.js'

export default function MyPage() {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [rolls, setRolls] = useState([])

  useEffect(() => {
    let cancelled = false

    const fetchMyRolls = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await apiClient.get('/roll/me')
        if (cancelled) return

        const data = response?.data?.data ?? []
        setRolls(Array.isArray(data) ? data : [])
      } catch (error) {
        if (cancelled) return

        if (isAppError(error)) {
          setErrorMessage(toUserMessage(error))
          return
        }

        setErrorMessage('요청 처리 중 오류가 발생했어요.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMyRolls()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack spacing={2}>
        <Typography variant="h4">MyPage</Typography>
        {loading ? <CircularProgress size={28} /> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {!loading && !errorMessage && rolls.length === 0 ? (
          <Typography color="text.secondary">등록된 롤링페이퍼가 없습니다.</Typography>
        ) : null}
        {!loading && !errorMessage && rolls.length > 0 ? (
          <Stack spacing={1}>
            {rolls.map((roll) => (
              <Box key={roll.rollId ?? roll.id} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1">
                  {roll.rollName ?? roll.name ?? '이름 없음'}
                </Typography>
                <Typography color="text.secondary">{roll.url ?? 'url 없음'}</Typography>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  )
}
