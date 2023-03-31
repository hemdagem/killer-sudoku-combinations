import * as React from "react";
import NavBar from "../components/NavBar";
import Head from "../components/Head";
import { data, Nodes } from "../models/Types";
import { graphql, PageProps } from "gatsby";
import { useState } from "react";

const IndexPage = (data: PageProps<data>) => {
  const sizes = [2, 3, 4, 5, 6, 7, 8, 9];

  var cellSize = React.createRef();
  var total = React.createRef();
  const excludedNumbers = React.useRef([]);

  const getCombinations = () =>
    typeof window !== "undefined" ? localStorage.getItem("combinations") : "";

  const allData = React.useMemo(() => {
    const savedData = getCombinations();
    if (savedData) {
      return JSON.parse(savedData);
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem("combinations", JSON.stringify(data));
      }
      return data;
    }
  }, [data]);

  const [results, setFilteredResults] = useState(allData);

  const SetFilterSize = () => {
    let tempResults = JSON.parse(getCombinations()) as PageProps<data>;
    let cellSizeNumber = Number.parseInt(cellSize.current.value);
    let totalNumber = Number.parseInt(total.current.value);

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

  const handleExcludedNumbersChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    excludedNumbers.current = Array.from(e.target.selectedOptions).map(
      (option) => parseInt(option.value, 10)
    );
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
              <select
                className="form-select"
                name="cell-size"
                ref={cellSize}
                onChange={(e) => SetFilterSize()}
              >
                <option value="0">All</option>
                {sizes.map((size) => {
                  return (
                    <option value={size} key={size}>
                      {size}
                    </option>
                  );
                })}
              </select>
              <label htmlFor="cell-size">Cell Size</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <select
                className="form-select"
                name="total"
                ref={total}
                onChange={(e) => SetFilterSize()}
              >
                <option value="0">All</option>
                {Array(46)
                  .fill(0, 1)
                  .map((el, i) => (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  ))}
              </select>
              <label htmlFor="total">Total</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <select
                className="form-select"
                id="exclude-numbers"
                onChange={(e) => handleExcludedNumbersChange(e)}
                multiple
              >
                {Array(9)
                  .fill(0, 1)
                  .map((el, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  ))}
              </select>
              <label htmlFor="exclude-numbers">Exclude Numbers</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {results.data.allCombinationsJson.nodes.map((item) => (
              <div>
                <h3 className="gy-5">Cell Size {item.size}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Total</th>
                      <th scope="col">Combinations</th>
                    </tr>
                  </thead>

                  {item.combinations.map((row) => (
                    <tbody>
                      <tr key={row.total}>
                        <td>{row.total}</td>
                        <td>{row.combination}</td>
                      </tr>
                    </tbody>
                  ))}
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
