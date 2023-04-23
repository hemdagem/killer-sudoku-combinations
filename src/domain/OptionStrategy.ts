export interface IOptionStrategy {
  setValue: (value: number[]) => void;
  getValue: () => number[];
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
}

export class CellSizeStrategy implements IOptionStrategy {
  constructor() {  }

  private cellSize = 1;

  setValue = (value: number[]) => {
    this.cellSize = value[0] ?? 0;
  }
  getValue = () => {
    return [this.cellSize];
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
}


