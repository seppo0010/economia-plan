const ACTION_SET = 'set'

export function subjectsDifficultyReducer(state: {[subject: string]: number} = {}, action: any) {
  if (typeof state !== typeof undefined && action.type === ACTION_SET) {
    const newState = Object.fromEntries(Object.entries(state))
    const {id, difficulty} = action
    newState[id] = difficulty
    return newState
  }
  return state
}

export function setDifficulty(id: string, difficulty: number) {
  return {
    type: ACTION_SET,
    id,
    difficulty,
  }
}
