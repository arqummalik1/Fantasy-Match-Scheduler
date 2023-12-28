export const addMatch = (match) => ({
  type: 'ADD_MATCH',
  payload: match,
});
export const editMatch = (match) => ({
  type: 'EDIT_MATCH',
  payload: match,
});

export const deleteMatch = (matchId) => ({
  type: 'DELETE_MATCH',
  payload: matchId,
});
export const updateMatch = (match) => ({
  type: 'UPDATE_MATCH',
  payload: match,
});
