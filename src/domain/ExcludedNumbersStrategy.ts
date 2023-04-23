import { Nodes } from "../models/Types";
import { IOptionStrategy } from "./IOptionStrategy";


export class ExcludedNumbersStrategy implements IOptionStrategy {
  constructor() { }

  private excludedNumbers = [];

  setValue = (value: number[]) => {
    this.excludedNumbers = value;
  };

  getValue = () => {
    return this.excludedNumbers;
  };

  filter = (nodes: Nodes[]) => {
    const excluded = this.getValue();
    if (excluded.length > 0) {
      nodes.forEach((x) => {
        x.combinations.forEach((comb, index, theArray) => {
          var combination = theArray[index].combination[0]
            .split(" ")
            .filter(function (str: string) {
              var count = 0;

              excluded.forEach((element) => {
                count += str.indexOf(element) === -1 ? 0 : 1;
              });
              return count === 0;
            })
            .join(" ");

          if (combination.length === 0) {
            delete theArray[index];
            return;
          }

          theArray[index].combination[0] = combination;
        });
      });
    }
    return nodes;
  };

  options = () => Array(10).fill(0, 1).map((el, i) => ({ value: i, label: i.toString() }));


}
