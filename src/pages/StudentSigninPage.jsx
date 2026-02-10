import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { apiClient } from '../shared/api/apiClient.js'
import { isAppError } from '../shared/error/AppError.js'
import { toUserMessage } from '../shared/error/toUserMessage.js'
import { resolveReturnTo } from '../shared/auth/resolveReturnTo.js'

const schema = z.object({
  rollUrl: z
    .string()
    .trim()
    .min(1, '롤링페이퍼 주소 키를 입력해주세요.'),
  classCode: z
    .string()
    .trim()
    .min(1, '학급코드를 입력해주세요.'),
  studentName: z
    .string()
    .trim()
    .min(1, '이름을 입력해주세요.'),
  pinNumber: z
    .string()
    .trim()
    .regex(/^\d{4}$/, '비밀번호는 4자리 숫자여야 합니다.'),
})

const defaultValues = {
  rollUrl: '',
  classCode: '',
  studentName: '',
  pinNumber: '',
}

export default function StudentSigninPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const rollUrlParam = searchParams.get('url') ?? ''
  const returnToParam = searchParams.get('returnTo') ?? ''

  const resolvedDefaultValues = useMemo(() => {
    return {
      ...defaultValues,
      rollUrl: rollUrlParam,
    }
  }, [rollUrlParam])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: resolvedDefaultValues,
  })

  const handleSuccessNavigate = (rollUrl) => {
    const fallbackPath = `/roll/${rollUrl}/join`
    const returnTo = resolveReturnTo(returnToParam, fallbackPath)
    navigate(returnTo, { replace: true })
  }

  const onSubmit = async (values) => {
    setSubmitError('')
    const payload = {
      name: values.studentName.trim(),
      classCode: values.classCode.trim(),
      pinNumber: values.pinNumber.trim(),
    }

    try {
      await apiClient.post(`/roll/${values.rollUrl}/join`, payload)
      handleSuccessNavigate(values.rollUrl)
    } catch (error) {
      if (isAppError(error)) {
        setSubmitError(toUserMessage(error))
        return
      }

      setSubmitError('요청 처리 중 오류가 발생했어요.')
    }
  }

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Stack spacing={3}>
        <Box
          component="img"
          src="/images/logo/image_logo.png"
          alt="Sparkle Note"
          sx={{ width: 180, height: 'auto' }}
        />
        <Typography variant="h4">학생 입장</Typography>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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

