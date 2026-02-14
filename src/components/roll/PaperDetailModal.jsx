import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { usePaperDetailModalModel } from '../../shared/hooks/usePaperDetailModalModel.js'

export default function PaperDetailModal({
  open,
  paper,
  role,
  currentStudentId,
  onClose,
  onUpdatePaper,
  onDeletePaper,
}) {
  const {
    content,
    authorName,
    authorRole,
    canEdit,
    isEditing,
    setIsEditing,
    draft,
    setDraft,
    actionError,
    saving,
    deleting,
    handleSave,
    handleDelete,
  } = usePaperDetailModalModel({
    open,
    paper,
    role,
    currentStudentId,
    onClose,
    onUpdatePaper,
    onDeletePaper,
  })

  if (!paper) return null

  const displayAuthor = authorRole === 'TEACHER' ? '선생님' : authorName

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>From. {displayAuthor}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {actionError ? <Alert severity="error">{actionError}</Alert> : null}
          {!isEditing ? (
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{content}</Typography>
          ) : (
            <TextField
              multiline
              minRows={4}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {canEdit ? (
          isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)}>취소</Button>
              <Button onClick={handleSave} variant="contained" disabled={saving}>
                저장
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button color="error" onClick={handleDelete} disabled={deleting}>
                삭제
              </Button>
            </>
          )
        ) : (
          <Button onClick={onClose}>닫기</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
