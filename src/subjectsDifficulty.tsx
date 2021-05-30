const ACTION_SET_DIFFICULTY = 'set_difficulty'
const ACTION_SET_SUBJECTS_PER_CUATRIMESTRE = 'set_subjects_per_cuatrimestre'

export function subjectsDifficultyReducer(state: number = 80, action: any) {
  if (typeof state !== typeof undefined && action.type === ACTION_SET_DIFFICULTY) {
    const {difficulty} = action
    return difficulty
  }
  return state
}

export function setDifficulty(difficulty: number) {
  return {
    type: ACTION_SET_DIFFICULTY,
    difficulty,
  }
}

export function subjectsPerCuatrimestreReducer(state: number = 3, action: any) {
  if (typeof state !== typeof undefined && action.type === ACTION_SET_SUBJECTS_PER_CUATRIMESTRE) {
    const {subjectsPerCuatrimestre} = action
    return subjectsPerCuatrimestre
  }
  return state
}

export function setSubjectsPerCuatrimestre(subjectsPerCuatrimestre: number) {
  return {
    type: ACTION_SET_SUBJECTS_PER_CUATRIMESTRE,
    subjectsPerCuatrimestre,
  }
}
