import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/apiClient.js'
import { isAppError } from '../error/AppError.js'
import { toUserMessage } from '../error/toUserMessage.js'

export function usePaperDetailModalModel({
  open,
  paper,
  role,
  currentStudentId,
  onClose,
  onUpdatePaper,
  onDeletePaper,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [actionError, setActionError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const paperId = paper?.paperId ?? paper?.id
  const content = paper?.content ?? ''
  const authorName = paper?.authorName ?? '익명'
  const authorRole = paper?.authorRole ?? ''
  const authorStudentId = paper?.studentId ?? paper?.authorStudentId ?? null

  const canEdit = useMemo(() => {
    if (role === 'TEACHER') return true
    if (currentStudentId == null) return false
    return Number(currentStudentId) === Number(authorStudentId)
  }, [role, currentStudentId, authorStudentId])

  useEffect(() => {
    if (open) {
      setIsEditing(false)
      setDraft(content)
      setActionError('')
    }
  }, [open, content])

  const handleSave = async () => {
    const nextContent = draft.trim()
    if (!nextContent) {
      setActionError('수정할 내용을 입력해주세요.')
      return
    }
    if (nextContent === content) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    setActionError('')

    try {
      await apiClient.put(`/paper/${paperId}`, { content: nextContent })
      onUpdatePaper?.(paperId, nextContent)
      setIsEditing(false)
      onClose?.()
    } catch (error) {
      if (isAppError(error)) {
        setActionError(toUserMessage(error))
      } else {
        setActionError('요청 처리 중 오류가 발생했어요.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('해당 페이퍼를 삭제하시겠습니까?')) return

    setDeleting(true)
    setActionError('')

    try {
      await apiClient.delete(`/paper/${paperId}`)
      onDeletePaper?.(paperId)
      onClose?.()
    } catch (error) {
      if (isAppError(error)) {
        setActionError(toUserMessage(error))
      } else {
        setActionError('요청 처리 중 오류가 발생했어요.')
      }
    } finally {
      setDeleting(false)
    }
  }

  return {
    paperId,
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
  }
}
