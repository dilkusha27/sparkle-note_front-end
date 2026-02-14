import { Alert, CircularProgress, Typography } from '@mui/material'

export default function RequestStateView({
  loading,
  errorMessage,
  isEmpty,
  emptyMessage,
  children,
}) {
  if (loading) {
    return <CircularProgress size={28} />
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  if (isEmpty) {
    return <Typography color="text.secondary">{emptyMessage}</Typography>
  }

  return children
}
