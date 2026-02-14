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
import { useCreatePaperModalModel } from '../../shared/hooks/useCreatePaperModalModel.js'

export default function CreatePaperModal({ open, onClose, rollId, onCreated }) {
  const { submitError, register, errors, isSubmitting, submit, handleDialogEnter } =
    useCreatePaperModalModel({
      rollId,
      onClose,
      onCreated,
    })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEnter: handleDialogEnter,
      }}
    >
      <DialogTitle>롤링페이퍼 작성</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <TextField
            label="내용"
            placeholder="내용을 입력하세요"
            multiline
            minRows={4}
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
            {...register('content')}
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
