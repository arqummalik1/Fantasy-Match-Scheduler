
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "./reducers"; 


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['matches'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
