export const sortNumberAsc = (a: number, b: number) => {
  return a - b;
};

export const sortNumberDesc = (a: number, b: number) => {
  return b - a;
};

export const sortNumbers = (collection: number[], asc = true) => {
  return collection.slice().sort(asc ? sortNumberAsc : sortNumberDesc);
};
