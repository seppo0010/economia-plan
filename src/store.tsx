import { combineReducers } from 'redux'
import { subjectsStatusReducer } from './subjectsStatus'
import { createStore } from 'redux'

let rootReducer = combineReducers({subjectsStatus: subjectsStatusReducer})

let store = createStore(rootReducer);
export type RootState = ReturnType<typeof store.getState>
export default store;
