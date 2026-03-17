import { configureStore } from '@reduxjs/toolkit';
import grievanceReducer from './slices/grievanceSlice';

export const store = configureStore({
  reducer: {
    grievance: grievanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
