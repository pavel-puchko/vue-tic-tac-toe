

export const getEmptyCells = (size) => {
  const cells = {}
  const tempSize = size * size;
  for (let i = 1; i < tempSize + 1; i++) {
    cells[i] = '';
  }
  return cells;
}