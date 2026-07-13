
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        tasks: taskReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;