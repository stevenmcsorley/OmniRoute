import { useCallback, useMemo, useState } from "react";
import './Table.css';

export interface Column<T> {
  Header: string;
  accessor: keyof T;
  isSortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyAccessor: keyof T;
  onPaginate?: (pageNumber: number) => void;
  currentPage?: number;
  totalPages?: number;
  getRowClassName?: (item: T) => string;  // Function to get class name for a row
}

function Table<T>({
  columns,
  data,
  keyAccessor, 
  onPaginate,
  currentPage,
  totalPages,
  getRowClassName,
}: TableProps<T>): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "ascending" | "descending" } | null>(null);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = useCallback((key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);


  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
              className="th"
                key={column.accessor as string}
                onClick={column.isSortable ? () => requestSort(column.accessor) : undefined}
              >
                {column.Header}
                {sortConfig && sortConfig.key === column.accessor
                  ? sortConfig.direction === "ascending"
                    ? " 🔼"
                    : " 🔽"
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
                        <tr key={item[keyAccessor] as React.Key} className={getRowClassName ? getRowClassName(item) : ''}>

              {columns.map((column) => (
                <td className="td" key={`${column.accessor as string}`}>
                  {item[column.accessor] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {onPaginate && totalPages && currentPage && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className="page-item">
                <a onClick={() => onPaginate(i + 1)} href="#!">
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Table;
