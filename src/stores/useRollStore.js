import create from "zustand";

const useRollStore = create((set) => ({
    showGuide: true,
    isCreateRollModalOpen: false,
    isUpdateRollModalOpen: false,
    userInfo: null,
    rolls: [],

    setShowGuide: (value) => set({ showGuide: value}),
    toggleCreateRollModal: () => set((state) => ({ isCreateRollModalOpen: !state.isCreateRollModalOpen})),
    toggleUpdateRollModal: () => set((state) => ({ isUpdateRollModalOpen: !state.isUpdateRollModalOpen})),
    setUserInfo: (info) => set({ userInfo: info }),
    setRolls: (rolls) => set({ rolls }), // set({ rolls: rolls })와 동일한 의미 - 단축 속성명
}));

export default useRollStore;