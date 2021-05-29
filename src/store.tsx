import { combineReducers } from 'redux'
import { subjectsStatusReducer } from './subjectsStatus'
import { subjectsDifficultyReducer } from './subjectsDifficulty'
import { createStore } from 'redux'

let rootReducer = combineReducers({subjectsStatus: subjectsStatusReducer, subjectsDifficulty: subjectsDifficultyReducer})

let store = createStore(rootReducer);
export type RootState = ReturnType<typeof store.getState>
export default store;
