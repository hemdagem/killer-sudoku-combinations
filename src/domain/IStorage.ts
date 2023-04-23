export interface IStorage {
  getCombinations: (key: string) => string | null;
  setCombinations: (key: string, data: string) => void;
}
