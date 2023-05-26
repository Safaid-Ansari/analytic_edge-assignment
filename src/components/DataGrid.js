import { useEffect, useState } from "react";
import "../styles/DataGrid.css";
const DataGrid = ({ endpoint, pageSize, name }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchWord, setSearchWord] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      fetchData();
    } else {
      setIsMounted(true);
    }
  }, [
    currentPage,
    searchWord,
    filterAttribute,
    filterValue,
    sortColumn,
    sortDirection,
  ]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    const start = (currentPage - 1) * pageSize;
    let url = `${endpoint}?_start=${start}&_limit=${pageSize}`;

    if (searchWord) {
      url += `&q=${searchWord}`;
    }

    if (filterAttribute && filterValue) {
      url += `&${filterAttribute}=${filterValue}`;
    }

    if (sortColumn) {
      url += `&_sort=${sortColumn}&_order=${sortDirection}`;
    }

    if (filterAttribute && filterValue) {
      url += `&${filterAttribute}=${filterValue}`;
    }

    let totalCount;
    // Check if data is already cached
    if (sessionStorage.getItem(url)) {
      const cachedData = JSON.parse(sessionStorage.getItem(url));
      setData(cachedData.data);
      setTotalPages(cachedData.totalPages);
    } else {
      fetch(url)
        .then((response) => {
          totalCount = response.headers.get("X-Total-Count");
          setTotalPages(Math.ceil(totalCount / pageSize));

          if (start >= totalCount) {
            // If the start index is greater than or equal to the total count,
            // update the current page and return an empty array
            setCurrentPage(1);
            return [];
          }

          return response.json();
        })
        .then((data) => {
          setData(data);

          // Cache the fetched data
          const cachedData = {
            data: data,
            totalPages: Math.ceil(totalCount / pageSize),
          };
          sessionStorage.setItem(url, JSON.stringify(cachedData));
        })
        .catch((error) => console.log(error));
    }
  };
  const handleSearch = (event) => {
    setSearchWord(event.target.value);
  };

  const handleFilterAttributeChange = (event) => {
    setFilterAttribute(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };
  const handleSort = (column) => {
    if (column === sortColumn) {
      // If already sorted by the same column, reverse the sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new column, set the sort column and default to ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const getCellValue = (value) => {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="data-grid-container">
      <h1>{name}</h1>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search"
          value={searchWord}
          onChange={handleSearch}
        />
        <select value={filterAttribute} onChange={handleFilterAttributeChange}>
          <option value="">Select Attribute</option>
          {Object.keys(data[0] || {}).map((attribute, index) => (
            <option key={index} value={attribute}>
              {attribute}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter Value"
          value={filterValue}
          onChange={handleFilterValueChange}
        />
      </div>
      <table className="data-grid">
        <thead>
          <tr>
            {Object.keys(data[0] || {}).map((header, index) => (
              <th key={index} onClick={() => handleSort(header)}>
                {header}{" "}
                {sortColumn === header && (
                  <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, index) => (
                <td key={index}>{getCellValue(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="total-pages">Total Pages:{totalPages}</div>
    </div>
  );
};

export default DataGrid;
