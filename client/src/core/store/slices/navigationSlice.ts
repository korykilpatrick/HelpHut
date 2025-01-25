import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  currentPortal: 'donor' | 'volunteer' | 'partner' | 'admin' | null;
  isSidebarOpen: boolean;
  currentPath: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
  }>;
}

const initialState: NavigationState = {
  currentPortal: null,
  isSidebarOpen: true,
  currentPath: '/',
  breadcrumbs: [],
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPortal: (state, action: PayloadAction<NavigationState['currentPortal']>) => {
      state.currentPortal = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<NavigationState['breadcrumbs']>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { setCurrentPortal, toggleSidebar, setCurrentPath, setBreadcrumbs } = navigationSlice.actions;
export default navigationSlice.reducer; 