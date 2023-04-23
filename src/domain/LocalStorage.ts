import { IStorage } from "./IStorage";


export class LocalStorage implements IStorage {
  constructor() { }
  getCombinations = (key: string) => typeof window !== "undefined" ? localStorage.getItem(key) : "";
  setCombinations = (key: string, data: string) => typeof window !== "undefined" ? localStorage.setItem(key, data)
    : "";
}
