
export interface IStorage {
    getCombinations: (key: string) => string | null;
    setCombinations: (key: string, data: string) => void;
  }

  export class LocalStorage implements IStorage {
    constructor() {}
      getCombinations = (key: string) => typeof window !== "undefined" ? localStorage.getItem(key) : "";
      setCombinations = (key: string, data: string) =>  typeof window !== "undefined" ? localStorage.setItem(key, data)
      : "";
  }
