import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/apiClient.js'
import { isAppError } from '../error/AppError.js'
import { toUserMessage } from '../error/toUserMessage.js'

function getRollInfoFromState(state) {
  return {
    rollId: state?.rollId ?? null,
    rollName: state?.rollName ?? '',
    role: state?.role ?? '',
    currentStudentId: state?.currentStudentId ?? null,
  }
}

export function useRollingPaperModel({ rollUrl, locationState }) {
  const initial = useMemo(() => getRollInfoFromState(locationState), [locationState])

  const [rollId, setRollId] = useState(initial.rollId)
  const [rollName, setRollName] = useState(initial.rollName)
  const [role, setRole] = useState(initial.role)
  const [currentStudentId, setCurrentStudentId] = useState(initial.currentStudentId)
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)

  useEffect(() => {
    let cancelled = false

    const resolveRollInfo = async () => {
      if (rollId || !rollUrl) return

      try {
        const response = await apiClient.get(`/roll/${rollUrl}`)
        const data = response?.data?.data ?? {}
        if (cancelled) return
        setRollId(data.rollId ?? data.id ?? null)
        setRollName(data.rollName ?? data.name ?? rollUrl)
      } catch (error) {
        if (cancelled) return
        if (isAppError(error)) {
          setErrorMessage(toUserMessage(error))
          return
        }
        setErrorMessage('롤 정보를 불러오지 못했어요.')
      }
    }

    resolveRollInfo()

    return () => {
      cancelled = true
    }
  }, [rollId, rollUrl])

  useEffect(() => {
    let cancelled = false

    const resolveProfile = async () => {
      if (role && currentStudentId != null) return

      try {
        const response = await apiClient.get('/user/profile')
        if (cancelled) return
        const data = response?.data?.data ?? {}
        setRole((prev) => prev || data.role || '')
        setCurrentStudentId((prev) => prev ?? data.studentId ?? data.id ?? null)
      } catch (error) {
        if (cancelled) return
        if (isAppError(error)) {
          setErrorMessage(toUserMessage(error))
          return
        }
        setErrorMessage('사용자 정보를 불러오지 못했어요.')
      }
    }

    resolveProfile()

    return () => {
      cancelled = true
    }
  }, [role, currentStudentId])

  useEffect(() => {
    let cancelled = false

    const fetchPapers = async () => {
      if (!rollId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMessage('')

      try {
        const response = await apiClient.get(`/paper/rolls/${rollId}`)
        if (cancelled) return
        const data = response?.data?.data ?? []
        setPapers(Array.isArray(data) ? data : [])
      } catch (error) {
        if (cancelled) return
        if (isAppError(error)) {
          setErrorMessage(toUserMessage(error))
          return
        }
        setErrorMessage('요청 처리 중 오류가 발생했어요.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPapers()

    return () => {
      cancelled = true
    }
  }, [rollId])

  const handlePaperCreated = (paper) => {
    if (paper) {
      setPapers((prev) => [paper, ...prev])
    }
  }

  const handleUpdatePaper = (paperId, newContent) => {
    setPapers((prev) =>
      prev.map((paper) =>
        (paper.paperId ?? paper.id) === paperId ? { ...paper, content: newContent } : paper,
      ),
    )
    setSelectedPaper((prev) =>
      prev && (prev.paperId ?? prev.id) === paperId ? { ...prev, content: newContent } : prev,
    )
  }

  const handleDeletePaper = (paperId) => {
    setPapers((prev) => prev.filter((paper) => (paper.paperId ?? paper.id) !== paperId))
    setSelectedPaper((prev) =>
      prev && (prev.paperId ?? prev.id) === paperId ? null : prev,
    )
  }

  return {
    rollId,
    rollName,
    role,
    currentStudentId,
    papers,
    loading,
    errorMessage,
    createOpen,
    selectedPaper,
    setCreateOpen,
    setSelectedPaper,
    handlePaperCreated,
    handleUpdatePaper,
    handleDeletePaper,
  }
}
