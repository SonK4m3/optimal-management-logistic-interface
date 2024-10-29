import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sidebarReducer from './sidebarSlice'
import userReducer from './userSlice'

const rootPersistConfig = {
    key: 'root',
    storage,
    whitelist: ['sidebar', 'user']
}

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
