import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient.js'
import { isAppError } from '../error/AppError.js'
import { toUserMessage } from '../error/toUserMessage.js'

function getRollId(roll) {
  return roll?.rollId ?? roll?.id
}

function getRollName(roll) {
  return roll?.rollName ?? roll?.name ?? '이름 없음'
}

function getRollUrl(roll) {
  return roll?.url ?? roll?.rollUrl ?? ''
}

export function useMyPageModel({ onEnterRoll }) {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [rolls, setRolls] = useState([])
  const [profile, setProfile] = useState({ name: '', role: '', studentId: null })
  const [createOpen, setCreateOpen] = useState(false)
  const [editingRoll, setEditingRoll] = useState(null)

  const fetchMyRolls = useCallback(async (signal) => {
    setLoading(true)
    setErrorMessage('')

    try {
      const requestConfig = signal ? { signal } : undefined
      const [profileResponse, rollResponse] = await Promise.all([
        apiClient.get('/user/profile', requestConfig),
        apiClient.get('/roll/me', requestConfig),
      ])

      const profileData = profileResponse?.data?.data ?? {}
      setProfile({
        name: profileData.name ?? '',
        role: profileData.role ?? '',
        studentId: profileData.studentId ?? profileData.id ?? null,
      })

      const data = rollResponse?.data?.data ?? []
      setRolls(Array.isArray(data) ? data : [])
    } catch (error) {
      if (signal?.aborted) return

      if (isAppError(error)) {
        setErrorMessage(toUserMessage(error))
        return
      }

      setErrorMessage('요청 처리 중 오류가 발생했어요.')
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchMyRolls(controller.signal)
    return () => controller.abort()
  }, [fetchMyRolls])

  const handleEnterRoll = (roll) => {
    const rollId = getRollId(roll)
    const rollName = getRollName(roll)
    const rollUrl = getRollUrl(roll)

    if (!rollUrl) {
      setErrorMessage('롤 주소 키가 없습니다.')
      return
    }

    onEnterRoll({
      rollId,
      rollName,
      rollUrl,
      role: profile.role,
      currentStudentId: profile.studentId,
    })
  }

  const handleCopyUrl = async (roll) => {
    const rollUrl = getRollUrl(roll)
    if (!rollUrl) {
      setErrorMessage('롤 주소 키가 없습니다.')
      return
    }

    try {
      const shareUrl = new URL(
        `/student/signin?url=${encodeURIComponent(rollUrl)}`,
        window.location.origin,
      )
      await navigator.clipboard.writeText(shareUrl.toString())
    } catch {
      setErrorMessage('URL 복사에 실패했어요.')
    }
  }

  const handleDelete = async (roll) => {
    const rollId = getRollId(roll)
    if (!rollId) return

    if (!window.confirm('학급을 삭제하시겠습니까? 삭제된 학급은 복구할 수 없습니다.')) {
      return
    }

    try {
      await apiClient.delete(`/roll/${rollId}`)
      setRolls((prev) => prev.filter((item) => getRollId(item) !== rollId))
    } catch (error) {
      if (isAppError(error)) {
        setErrorMessage(toUserMessage(error))
        return
      }
      setErrorMessage('요청 처리 중 오류가 발생했어요.')
    }
  }

  const handleRollCreated = (created) => {
    if (created && getRollId(created)) {
      setRolls((prev) => [created, ...prev])
      return
    }
    fetchMyRolls()
  }

  const handleRollUpdated = (updated) => {
    if (!updated) return
    const updatedId = getRollId(updated)
    setRolls((prev) => prev.map((roll) => (getRollId(roll) === updatedId ? updated : roll)))
  }

  return {
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
  }
}
