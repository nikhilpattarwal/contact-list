import { combineReducers, configureStore} from '@reduxjs/toolkit';
import { contactReducer } from '../redux/reducer/contactReducer';


const rootReducers = combineReducers({contactReducer})
export const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware({
    serializableCheck: false
  })
});
