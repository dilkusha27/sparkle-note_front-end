import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import imageLogo from '../assets/images/logo/image_logo.png'
import SocialLoginButtons from '../components/auth/SocialLoginButtons.jsx'
import { useStudentSigninModel } from '../shared/hooks/useStudentSigninModel.js'

export default function StudentSigninPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const rollUrlParam = searchParams.get('url') ?? ''
  const returnToParam = searchParams.get('returnTo') ?? ''
  const { submitError, register, errors, isSubmitting, submit } = useStudentSigninModel({
    rollUrlParam,
    returnToParam,
    onSuccessNavigate: (path) => navigate(path, { replace: true }),
  })

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Stack spacing={3}>
        <Box
          component="img"
          src={imageLogo}
          alt="Sparkle Note"
          sx={{ width: 180, height: 'auto' }}
        />
        <SocialLoginButtons />
        <Typography variant="h4">학생 입장</Typography>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}
        <Box
          component="form"
          onSubmit={submit}
          sx={{ display: 'grid', gap: 2 }}
        >
          <TextField
            label="롤링페이퍼 주소 키"
            placeholder="예: sparkle-2026"
            error={Boolean(errors.rollUrl)}
            helperText={errors.rollUrl?.message}
            {...register('rollUrl')}
          />
          <TextField
            label="학급코드"
            error={Boolean(errors.classCode)}
            helperText={errors.classCode?.message}
            {...register('classCode')}
          />
          <TextField
            label="이름"
            error={Boolean(errors.studentName)}
            helperText={errors.studentName?.message}
            {...register('studentName')}
          />
          <TextField
            label="비밀번호(4자리)"
            type="password"
            inputProps={{ inputMode: 'numeric', maxLength: 4 }}
            error={Boolean(errors.pinNumber)}
            helperText={errors.pinNumber?.message}
            {...register('pinNumber')}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            롤링페이퍼 입장
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

