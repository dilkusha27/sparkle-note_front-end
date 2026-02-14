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

const defaultValues = {
  rollName: '',
}

export function useCreateRollModalModel({ onClose, onCreated }) {
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (values) => {
    setSubmitError('')

    try {
      const response = await apiClient.post('/roll', {
        rollName: values.rollName.trim(),
      })
      const created = response?.data?.data
      onCreated?.(created ?? null)
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
    reset(defaultValues)
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
