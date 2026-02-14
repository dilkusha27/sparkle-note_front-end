import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useUpdateRollModalModel } from '../../shared/hooks/useUpdateRollModalModel.js'

export default function UpdateRollModal({ open, onClose, roll, onUpdated }) {
  const { submitError, register, errors, isSubmitting, submit, handleDialogEnter } =
    useUpdateRollModalModel({
      roll,
      onClose,
      onUpdated,
    })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionProps={{
        onEnter: handleDialogEnter,
      }}
    >
      <DialogTitle>학급명 수정</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <TextField
            label="학급명"
            error={Boolean(errors.rollName)}
            helperText={errors.rollName?.message}
            {...register('rollName')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={submit} variant="contained" disabled={isSubmitting}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}
