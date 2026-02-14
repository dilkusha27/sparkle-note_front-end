import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import PaperItem from '../components/roll/PaperItem.jsx'
import CreatePaperModal from '../components/roll/CreatePaperModal.jsx'
import PaperDetailModal from '../components/roll/PaperDetailModal.jsx'
import RequestStateView from '../components/common/RequestStateView.jsx'
import { useRollingPaperModel } from '../shared/hooks/useRollingPaperModel.js'

export default function RollingPaperPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { rollUrl = '' } = useParams()
  const {
    rollId,
    rollName,
    role,
    currentStudentId,
    papers,
    loading,
    errorMessage,
    createOpen,
    setCreateOpen,
    selectedPaper,
    setSelectedPaper,
    handlePaperCreated,
    handleUpdatePaper,
    handleDeletePaper,
  } = useRollingPaperModel({
    rollUrl,
    locationState: location.state,
  })

  return (
    <Box sx={{ maxWidth: 980 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            {role === 'TEACHER' ? (
              <Button variant="outlined" onClick={() => navigate('/mypage')}>
                목록으로
              </Button>
            ) : null}
            <Typography variant="h4">{rollName || 'RollingPaper'}</Typography>
          </Stack>
          <Button
            variant="contained"
            onClick={() => setCreateOpen(true)}
            disabled={!rollId}
          >
            작성
          </Button>
        </Stack>

        <RequestStateView
          loading={loading}
          errorMessage={errorMessage}
          isEmpty={papers.length === 0}
          emptyMessage="작성된 페이퍼가 없습니다."
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {papers.map((paper) => (
              <PaperItem
                key={paper.paperId ?? paper.id}
                paper={paper}
                onOpenDetail={() => setSelectedPaper(paper)}
              />
            ))}
          </Box>
        </RequestStateView>
      </Stack>

      <CreatePaperModal
        open={createOpen}
        rollId={rollId}
        onClose={() => setCreateOpen(false)}
        onCreated={handlePaperCreated}
      />

      <PaperDetailModal
        open={Boolean(selectedPaper)}
        paper={selectedPaper}
        role={role}
        currentStudentId={currentStudentId}
        onClose={() => setSelectedPaper(null)}
        onUpdatePaper={handleUpdatePaper}
        onDeletePaper={handleDeletePaper}
      />
    </Box>
  )
}
