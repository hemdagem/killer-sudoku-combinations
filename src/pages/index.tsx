import * as React from "react";
import NavBar from "../components/NavBar";
import Head from "../components/Head";
import { data, Nodes } from "../models/Types";
import { graphql, PageProps } from "gatsby";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta } from "react-select";
import Select from "react-select";
import {IOptionStrategy,ExcludedNumbersStrategy, CellSizeStrategy, TotalStrategy, IncludedNumbersStrategy} from "../domain/OptionStrategy";
import { LocalStorage } from "../domain/Storage";

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

    console.log(cellSizeStrategy.getValue()[0]);

    var cellSizeFilter = tempResults.data.allCombinationsJson.nodes
      .filter(
        (result: Nodes) =>
        cellSizeStrategy.getValue()[0] === 0 || result.size === cellSizeStrategy.getValue()[0]
      )
      .map((item) => ({
        ...item,
        combinations: item.combinations.filter(
          (comb) => totalStrategy.getValue()[0] === 0 || comb.total === totalStrategy.getValue()[0]
        ),
      }));

    const excluded = excludedNumbersStrategy.getValue();
    console.log(excluded);
    if (excluded.length > 0) {
      cellSizeFilter.forEach((x) => {
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

    const included = includedNumbersStrategy.getValue();
    console.log(included);
    if (included.length > 0) {
      cellSizeFilter.forEach((x) => {
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
                options={Array(10)
                  .fill(0, 1)
                  .map((el, i) => ({
                    value: i === 1 ? 0 : i,
                    label: i === 1 ? "All" : i.toString(),
                  }))}
                placeholder="Cell Size"
                onChange={(e, i) => onChange(Array(e), i)}
                name="cell-size"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <Select
                options={Array(46)
                  .fill(0, 0)
                  .map((el, i) => ({
                    value: i === 0 ? 0 : i,
                    label: i === 0 ? "All" : i.toString(),
                  }))}
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
                options={Array(10)
                  .fill(0, 1)
                  .map((el, i) => ({ value: i, label: i }))}
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
                options={Array(10)
                  .fill(0, 1)
                  .map((el, i) => ({ value: i, label: i }))}
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
