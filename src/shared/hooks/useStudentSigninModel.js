import { useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { apiClient } from '../api/apiClient.js'
import { isAppError } from '../error/AppError.js'
import { toUserMessage } from '../error/toUserMessage.js'
import { resolveReturnTo } from '../auth/resolveReturnTo.js'

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

export function useStudentSigninModel({ rollUrlParam, returnToParam, onSuccessNavigate }) {
  const [submitError, setSubmitError] = useState('')

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

  const onSubmit = async (values) => {
    setSubmitError('')
    const payload = {
      name: values.studentName.trim(),
      classCode: values.classCode.trim(),
      pinNumber: values.pinNumber.trim(),
    }

    try {
      await apiClient.post(`/roll/${values.rollUrl}/join`, payload)
      const fallbackPath = `/roll/${values.rollUrl}/join`
      const returnTo = resolveReturnTo(returnToParam, fallbackPath)
      onSuccessNavigate(returnTo)
    } catch (error) {
      if (isAppError(error)) {
        setSubmitError(toUserMessage(error))
        return
      }

      setSubmitError('요청 처리 중 오류가 발생했어요.')
    }
  }

  return {
    submitError,
    register,
    errors,
    isSubmitting,
    submit: handleSubmit(onSubmit),
  }
}
