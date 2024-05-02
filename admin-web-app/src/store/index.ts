import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './resources/resourcesSlice';
import employeesReducer from './employees/employeesSlice';

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    employees: employeesReducer
  }
});

// Properly type the dispatch and RootState
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
