import * as React from "react";
import NavBar from "../components/NavBar";
import Head from "../components/Head";
import { data, Nodes } from "../models/Types";
import { graphql, PageProps } from "gatsby";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta } from "react-select";
import Select from "react-select";

const IndexPage = (data: PageProps<data>) => {
  var cellSize = React.useRef();
  var total = React.useRef();
  const excludedNumbers = React.useRef([]);

  const getCombinations = (key: string) =>
    typeof window !== "undefined" ? localStorage.getItem(key) : "";

  const setCombinations = (key: string, data: PageProps<data>) =>
    typeof window !== "undefined"
      ? localStorage.setItem(key, JSON.stringify(data))
      : "";

  const allData = React.useMemo(() => {
    const savedData = getCombinations("combinations");
    if (savedData) {
      return JSON.parse(savedData);
    }
    setCombinations("combinations", data);
    return data;
  }, [data]);

  const [results, setFilteredResults] = useState(allData);

  const SetFilterSize = () => {
    let tempResults = JSON.parse(
      getCombinations("combinations")
    ) as PageProps<data>;
    let cellSizeNumber = Number.parseInt(cellSize.current) ?? 0;
    let totalNumber = Number.parseInt(total.current);
    if (Number.isNaN(totalNumber)) {
      totalNumber = 0;
    }
    if (Number.isNaN(cellSizeNumber)) {
      cellSizeNumber = 0;
    }

    var cellSizeFilter = tempResults.data.allCombinationsJson.nodes
      .filter(
        (result: Nodes) =>
          cellSizeNumber === 0 || result.size === cellSizeNumber
      )
      .map((item) => ({
        ...item,
        combinations: item.combinations.filter(
          (comb) => totalNumber === 0 || comb.total === totalNumber
        ),
      }));

    const excluded = excludedNumbers.current;
    console.log(excluded);
    if (excluded.length > 0) {
      cellSizeFilter.forEach((x) => {
        x.combinations.forEach((comb, index, theArray) => {
          var combination = theArray[index].combination[0]
            .split(" ")
            .filter(function (str) {
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

    tempResults.data.allCombinationsJson.nodes = cellSizeFilter;

    setFilteredResults(tempResults);
  };

  const onChange = (
    options: readonly Option[],
    actionMeta: ActionMeta<Option>
  ) => {
    switch (actionMeta.name) {
      case "excluded-numbers":
        excludedNumbers.current = Array.from(options).map((option) =>
          parseInt(option.value, 10)
        );
        break;
      case "cell-size":
        cellSize.current = Array.from(options).map((option) =>
          parseInt(option.value, 10)
        );
        break;
      case "total":
        total.current = Array.from(options).map((option) =>
          parseInt(option.value, 10)
        );
        break;
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
                ref={cellSize}
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
                ref={total}
                name="total"
                defaultValue={{ label: "All", value: 0 }}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <CreatableSelect
                name="excluded-numbers"
                placeholder="Exclude Numbers"
                options={Array(10)
                  .fill(0, 2)
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
