export const getCurrentTurn = (fromDate: number, turnDuration: number) => {
  const timePassedInMs = Date.now() - fromDate;
  return Math.floor(timePassedInMs / turnDuration);
};

export const getActiveBidderId = (currentTurn: number, biddersCount: number) =>
  currentTurn % biddersCount;

export const calcRemainingTurnTime = (fromDate: number, turnDuration: number) => {
  const currentTurn = getCurrentTurn(fromDate, turnDuration);
  const nextTurnStartsAt = (currentTurn + 1) * turnDuration + fromDate;

  return nextTurnStartsAt - Date.now();
};
