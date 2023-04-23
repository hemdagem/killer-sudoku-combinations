import { Nodes } from "../models/Types";


export interface IOptionStrategy {
  setValue: (value: number[]) => void;
  getValue: () => number[];
  filter: (nodes: Nodes[]) => Nodes[];
  options: () => { value: number; label: string; }[];
}
