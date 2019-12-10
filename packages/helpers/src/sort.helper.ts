export function sortNumberAsc(a: number, b: number): number {
  return a - b;
}

export function sortNumberDesc(a: number, b: number): number {
  return b - a;
}

export function sortNumbers(collection: number[], asc = true): number[] {
  return collection.slice().sort(asc ? sortNumberAsc : sortNumberDesc);
}
