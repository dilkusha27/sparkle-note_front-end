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
import { useCreateRollModalModel } from '../../shared/hooks/useCreateRollModalModel.js'

export default function CreateRollModal({ open, onClose, onCreated }) {
  const { submitError, register, errors, isSubmitting, submit, handleDialogEnter } =
    useCreateRollModalModel({
      onClose,
      onCreated,
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
      <DialogTitle>학급 생성</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <TextField
            label="학급명"
            placeholder="새 학급명을 입력해주세요"
            error={Boolean(errors.rollName)}
            helperText={errors.rollName?.message}
            {...register('rollName')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={submit} variant="contained" disabled={isSubmitting}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  )
}
