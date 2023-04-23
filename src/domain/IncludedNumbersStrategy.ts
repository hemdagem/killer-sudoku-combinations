import { Nodes } from "../models/Types";
import { IOptionStrategy } from "./IOptionStrategy";


export class IncludedNumbersStrategy implements IOptionStrategy {
  constructor() { }

  private includedNumbers = [];

  setValue = (value: number[]) => {
    this.includedNumbers = value;
  };

  getValue = () => {
    return this.includedNumbers;
  };

  filter = (nodes: Nodes[]) => {
    const included = this.getValue();
    if (included.length > 0) {
      nodes.forEach((x) => {
        x.combinations.forEach((comb, index, theArray) => {
          var combination = theArray[index].combination[0]
            .split(" ")
            .filter(function (str: string) {
              var count = 0;

              included.forEach((element) => {
                count += str.indexOf(element) === -1 ? 1 : 0;
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
