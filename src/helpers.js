

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
      lastPlayedCellIndex: '',
      playerX: identity,
      playerO: opponentIdentity,
      hardFreeze: false,
      alinaWin: false,
      cells: getEmptyCells(room.boardSize),
    }
  }
}
export const getNewRoomDefaultConfig = (identity, size, winCount, vsBot = false) => {
  return {
      playerO: vsBot ? 'bot' : '',
      playerX: identity,
      creator: identity,
      boardSize: size,
      winCount: winCount,
      moves: 0,
      lastPlayedCellIndex: '',
      activePlayer: 'X',
      gameStatus: 'turn',
      winner: '',
      cells: getEmptyCells(size),
      vsBot
  }
}
export const getAlinaWinCells = (mark = 'X') => {
  const cells = getEmptyCells(15);
  const cellsToMark = [4,18,32,33,34,35,46,20,36,52, 4+8,18+8,32+8,46+8,20+8,36+8,52+8,  81, 96, 111, 126, 141, 85, 100, 115, 130, 145, 127, 113, 99,  219, 225, 205, 209, 206, 207, 208, 193, 191, 177, 211, 196, 181, 166,  217, 202, 187, 172, 182,183,184,185,186];
  cellsToMark.forEach((index) => {
    cells[index] = mark;
  });
  return cells;
}