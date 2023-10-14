// store.js (or wherever you've defined your zustand store)

import {create} from 'zustand';

const useAuthStore = create(set => ({
  isLoggedIn: false,
  userProfileImage: null,
  username: null,
  github_id : null,
  email: null,  // 이메일 상태 추가
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserProfileImage: (image) => set({ userProfileImage: image }),
  setUsername: (name) => set({ username: name }),
  setEmail: (email) => set({ email: email }),
  setGithub_id: (github_id) => set({ github_id: github_id })  // 이메일 설정 액션 추가
}));

export default useAuthStore;
