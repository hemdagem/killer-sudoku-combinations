import * as React from "react";
import NavBar from "../components/NavBar";
import Head from "../components/Head";
import { data } from "../models/Types";
import { graphql, PageProps } from "gatsby";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta } from "react-select";
import Select from "react-select";
import { IncludedNumbersStrategy } from "../domain/IncludedNumbersStrategy";
import { TotalStrategy } from "../domain/TotalStrategy";
import { CellSizeStrategy } from "../domain/CellSizeStrategy";
import { ExcludedNumbersStrategy } from "../domain/ExcludedNumbersStrategy";
import { IOptionStrategy } from "../domain/IOptionStrategy";
import { LocalStorage } from "../domain/LocalStorage";

const excludedNumbersStrategy = new ExcludedNumbersStrategy();
const totalStrategy = new TotalStrategy();
const includedNumbersStrategy = new IncludedNumbersStrategy();
const cellSizeStrategy = new CellSizeStrategy();
const localStorage = new LocalStorage();

const optionStrategies: Record<string, IOptionStrategy> = {
  "excluded-numbers": excludedNumbersStrategy,
  "cell-size": cellSizeStrategy,
  "total": totalStrategy,
  "included-numbers": includedNumbersStrategy,
};

const IndexPage = (data: PageProps<data>) => {

  const allData = React.useMemo(() => {
    const savedData = localStorage.getCombinations("combinations");
    if (savedData) {
      return JSON.parse(savedData);
    }
    localStorage.setCombinations("combinations", JSON.stringify(data));
    return data;
  }, [data]);

  const [results, setFilteredResults] = useState(allData);
 

  const SetFilterSize = () => {
    let tempResults = JSON.parse(localStorage.getCombinations("combinations")) as PageProps<data>;

    var cellSizeFilter = tempResults.data.allCombinationsJson.nodes;

    for(let prop in optionStrategies) {
      cellSizeFilter = optionStrategies[prop].filter(cellSizeFilter)
    }

    tempResults.data.allCombinationsJson.nodes = cellSizeFilter;

    setFilteredResults(tempResults);
  };

  const onChange = (
    options: readonly Option[],
    actionMeta: ActionMeta<Option>
  ) => {
    const strategy = optionStrategies[actionMeta.name];
    if (strategy) {
      strategy.setValue(Array.from(options).map((option) =>
        parseInt(option.value, 10)
      ));
    }
  
    SetFilterSize();
  };

  return (
    <main>
      <NavBar></NavBar>
      <Head title="Killer Sudoku Combinations | Featuring filters to focus on desired numbers"></Head>
      <div className="container my-4">
        <div className="row mb-3">
          <div className="col">
            <div className="form-floating">
              <Select
                options={cellSizeStrategy.options()}
                placeholder="Cell Size"
                onChange={(e, i) => onChange(Array(e), i)}
                name="cell-size"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <Select
                options={totalStrategy.options()}
                placeholder="Total"
                onChange={(e, i) => onChange(Array(e), i)}
                name="total"
                defaultValue={{ label: "All", value: 0 }}
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <div className="form-floating">
              <CreatableSelect
                name="excluded-numbers"
                placeholder="Exclude Numbers"
                options={excludedNumbersStrategy.options()}
                isMulti={true}
                onChange={(e, i) => onChange(e, i)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <CreatableSelect
                name="included-numbers"
                placeholder="Include Numbers"
                options={includedNumbersStrategy.options()}
                isMulti={true}
                onChange={(e, i) => onChange(e, i)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {results.data.allCombinationsJson.nodes.map((item) => (
              <div key={item.size}>
                <h3 className="gy-5">Cell Size {item.size}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Total</th>
                      <th scope="col">Combinations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.combinations.map((row) => (
                      <tr key={row.total}>
                        <td>{row.total}</td>
                        <td>{row.combination}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export const query = graphql`
  {
    allCombinationsJson {
      nodes {
        combinations {
          combination
          total
        }
        size
      }
    }
  }
`;

export default IndexPage;
