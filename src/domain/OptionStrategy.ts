import { Nodes } from "../models/Types";

export interface IOptionStrategy {
  setValue: (value: number[]) => void;
  getValue: () => number[];
  filter: (nodes: Nodes[]) => Nodes[];
}

export class ExcludedNumbersStrategy implements IOptionStrategy {
  constructor() {}

  private excludedNumbers = [];

  setValue = (value: number[]) => {
    this.excludedNumbers = value;
  };

  getValue = () => {
    return this.excludedNumbers;
  };

  filter = (nodes: Nodes[]) => {
    const excluded = this.getValue();
    console.log(excluded);
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
  }
}

export class CellSizeStrategy implements IOptionStrategy {
  constructor() {  }

  private cellSize = 0;

  setValue = (value: number[]) => {
    this.cellSize = value[0] ?? 0;
  }
  getValue = () => {
    return [this.cellSize];
  }

  filter = (nodes: Nodes[]) => {
    return nodes.filter(
      (result: Nodes) =>
      this.getValue()[0] === 0 || result.size === this.getValue()[0]
    )
  }

}

export class TotalStrategy implements IOptionStrategy {
  constructor() { }

  private total = 0;
  setValue = (value: number[]) => {
    this.total = value[0] ?? 0;
  }
  getValue = () => {
    return [this.total];
  }
  filter = (nodes: Nodes[]) => {
   return nodes.map((item) => ({
      ...item,
      combinations: item.combinations.filter(
        (comb) => this.getValue()[0] === 0 || comb.total === this.getValue()[0]
      ),
    }));
  }
}

export class IncludedNumbersStrategy implements IOptionStrategy {
  constructor() {}

  private includedNumbers = [];

  setValue = (value: number[]) => {
    this.includedNumbers = value;
  };

  getValue = () => {
    return this.includedNumbers;
  };

  filter = (nodes: Nodes[]) => {
    const included = this.getValue();
    console.log(included);
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
  }
}


