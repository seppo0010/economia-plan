const ACTION_TOGGLE = 'toggle'

export function subjectsStatusReducer(state: Set<string> = new Set(), action: any): Set<string> {
  const newState = new Set<string>()
  state.forEach((c) => newState.add(c))
  if (state && action.type === ACTION_TOGGLE) {
    const {id} = action
    if (state.has(id)) {
      newState.delete(id)
    } else {
      newState.add(id)
    }
    return newState
  }
  return newState
}

export function toggleSubject(id: string) {
  return {
    type: ACTION_TOGGLE,
    id,
  }
}
