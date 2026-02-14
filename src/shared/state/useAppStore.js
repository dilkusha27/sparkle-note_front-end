import { create } from 'zustand'

const initialState = {
  initialized: false,
  sessionChecked: false,
  userRole: '',
  studentId: null,
}

export const useAppStore = create((set) => ({
  ...initialState,
  setSession: (session) =>
    set(() => ({
      initialized: true,
      sessionChecked: true,
      userRole: session?.userRole ?? '',
      studentId: session?.studentId ?? null,
    })),
  clearSession: () =>
    set(() => ({
      ...initialState,
      initialized: true,
    })),
}))
