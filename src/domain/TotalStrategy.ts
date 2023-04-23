import { Nodes } from "../models/Types";
import { IOptionStrategy } from "./IOptionStrategy";


export class TotalStrategy implements IOptionStrategy {
  constructor() { }

  private total = 0;
  setValue = (value: number[]) => {
    this.total = value[0] ?? 0;
  };
  getValue = () => {
    return [this.total];
  };
  filter = (nodes: Nodes[]) => {
    return nodes.map((item) => ({
      ...item,
      combinations: item.combinations.filter(
        (comb) => this.getValue()[0] === 0 || comb.total === this.getValue()[0]
      ),
    }));
  };

  options = () => Array(46).fill(0, 0).map((el, i) => ({
    value: i === 0 ? 0 : i,
    label: i === 0 ? "All" : i.toString(),
  }));

}
