import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { apiClient } from '../api/apiClient.js'
import { isAppError } from '../error/AppError.js'
import { toUserMessage } from '../error/toUserMessage.js'

const schema = z.object({
  rollName: z.string().trim().min(1, '학급명을 입력해주세요.'),
})

export function useUpdateRollModalModel({ roll, onClose, onUpdated }) {
  const [submitError, setSubmitError] = useState('')
  const rollName = roll?.rollName ?? roll?.name ?? ''
  const rollId = roll?.rollId ?? roll?.id
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rollName,
    },
  })

  const onSubmit = async (values) => {
    setSubmitError('')

    try {
      const response = await apiClient.put(`/roll/${rollId}`, {
        rollName: values.rollName.trim(),
      })
      const updated = response?.data?.data ?? {
        ...roll,
        rollName: values.rollName.trim(),
      }
      onUpdated?.(updated)
      onClose?.()
    } catch (error) {
      if (isAppError(error)) {
        setSubmitError(toUserMessage(error))
        return
      }
      setSubmitError('요청 처리 중 오류가 발생했어요.')
    }
  }

  const handleDialogEnter = () => {
    reset({ rollName })
    setSubmitError('')
  }

  return {
    submitError,
    register,
    errors,
    isSubmitting,
    submit: handleSubmit(onSubmit),
    handleDialogEnter,
  }
}
