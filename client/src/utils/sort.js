export const sortInc = (data) => {
  return data.sort((a, b) => a.Amount - b.Amount);
};
export const sortDec = (data) => {
  return data.sort((a, b) => b.Amount - a.Amount);
};
