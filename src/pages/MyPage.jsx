import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import RollItem from '../components/roll/RollItem.jsx'
import CreateRollModal from '../components/roll/CreateRollModal.jsx'
import UpdateRollModal from '../components/roll/UpdateRollModal.jsx'
import RequestStateView from '../components/common/RequestStateView.jsx'
import { useMyPageModel } from '../shared/hooks/useMyPageModel.js'

export default function MyPage() {
  const navigate = useNavigate()
  const {
    loading,
    errorMessage,
    rolls,
    profile,
    createOpen,
    editingRoll,
    setCreateOpen,
    setEditingRoll,
    getRollId,
    handleEnterRoll,
    handleCopyUrl,
    handleDelete,
    handleRollCreated,
    handleRollUpdated,
  } = useMyPageModel({
    onEnterRoll: ({ rollId, rollName, rollUrl, role, currentStudentId }) => {
      navigate(`/roll/${rollUrl}/join`, {
        state: {
          rollId,
          rollName,
          role,
          currentStudentId,
        },
      })
    },
  })

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            {profile.name ? `${profile.name} 선생님` : 'MyPage'}
          </Typography>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            학급 생성
          </Button>
        </Stack>

        <RequestStateView
          loading={loading}
          errorMessage={errorMessage}
          isEmpty={rolls.length === 0}
          emptyMessage="등록된 롤링페이퍼가 없습니다."
        >
          <Stack spacing={1}>
            {rolls.map((roll) => (
              <RollItem
                key={getRollId(roll)}
                roll={roll}
                onEnter={handleEnterRoll}
                onCopyUrl={handleCopyUrl}
                onEdit={(item) => setEditingRoll(item)}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        </RequestStateView>
      </Stack>

      <CreateRollModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleRollCreated}
      />
      <UpdateRollModal
        open={Boolean(editingRoll)}
        roll={editingRoll}
        onClose={() => setEditingRoll(null)}
        onUpdated={handleRollUpdated}
      />
    </Box>
  )
}
