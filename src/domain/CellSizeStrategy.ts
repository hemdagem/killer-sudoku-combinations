import { Nodes } from "../models/Types";
import { IOptionStrategy } from "./IOptionStrategy";


export class CellSizeStrategy implements IOptionStrategy {
  constructor() { }

  private cellSize = 0;

  setValue = (value: number[]) => {
    this.cellSize = value[0] ?? 0;
  };
  getValue = () => {
    return [this.cellSize];
  };

  filter = (nodes: Nodes[]) => {
    return nodes.filter(
      (result: Nodes) => this.getValue()[0] === 0 || result.size === this.getValue()[0]
    );
  };

  options = () => Array(10).fill(0, 1).map((el, i) => ({
    value: i === 1 ? 0 : i,
    label: i === 1 ? "All" : i.toString(),
  }));

}
