

export const getEmptyCells = (size) => {
  const cells = {}
  const tempSize = size * size;
  for (let i = 1; i < tempSize + 1; i++) {
    cells[i] = '';
  }
  return cells;
}
export const getRestartGameConfig = (identity, room) => {
  {
    const opponentIdentity = room.playerX === identity ? 
      room.playerO :
      room.playerX;

    return {
      gameStatus: 'turn',
      activePlayer: 'X',
      moves: 0,
      winner: '',
      playerX: identity,
      playerO: opponentIdentity,
      hardFreeze: false,
      cells: getEmptyCells(room.boardSize),
    }
  }
}
export const getNewRoomDefaultConfig = (identity, size, winCount) => {
  return {
      playerO: '',
      playerX: identity,
      creator: identity,
      boardSize: size,
      winCount: winCount,
      moves: 0,
      activePlayer: "X",
      gameStatus: "turn",
      winner: "",
      cells: getEmptyCells(size)
  }
}