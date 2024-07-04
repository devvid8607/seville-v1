"use client";
import { useEffect, useState } from "react";
import fetchGraphQL from "./fetchImports";
import { DashboardJson } from "../sevilleGrid/constants/gridJsonConstants";

interface ImportsProps {
  pageSize: number;
  pageIndex: number;
  sortedColumn: { columnName: string; sortDirection: number };
  filterVariable: string;
}

interface GridJsonType {
  gridData: any[];
  selectedRow: any[];
  columnConfiguration: any;
  gridConfiguration: any;
}

interface ImportItem {
  Data: {
    id: string;
    Date: string;
    Filename: string;
    Matched: boolean;
    Status: string;
    Supplier: string;
    Unmatched: boolean;
    UploadedBy: string;
    Source: string;
    Name: string;
    _id: string;
  };
}

const Imports: React.FC<ImportsProps> = ({
  pageSize,
  pageIndex,
  sortedColumn,
  filterVariable,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [tableStoreData, setTableStoreData] = useState<GridJsonType>();
  const [currentPagination, setCurrentPagination] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  //   const [parentGridJson, setParentGridJson] =
  //     useState<GridJsonType>(DashboardJson);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(null);

      try {
        const data = await fetchGraphQL(
          `
          query GetImportsAndCount($filter: String, $sort: String, $pageIndex: Int, $pageSize: Int) {
            Imports(filter: $filter, sort: $sort, pageIndex: $pageIndex, pageSize: $pageSize) {
              _id
              Data {
                Date
                Filename
                Matched
                Status
                Supplier
                Unmatched
                UploadedBy
                Source {
                  Id
                  Name
                }
              }
            }
            countImports(pageSize: $pageSize, filter: $filter) {
              totalPages
              totalResults
            }
          }
        `,
          {}
        );

        const transformedImports = data.Imports.map(
          (importItem: ImportItem) => ({
            Date: importItem.Data.Date,
            Filename: importItem.Data.Filename,
            Matched: importItem.Data.Matched,
            Status: importItem.Data.Status,
            Supplier: importItem.Data.Supplier,
            Unmatched: importItem.Data.Unmatched,
            UploadedBy: importItem.Data.UploadedBy,
          })
        );

        setTableStoreData({
          gridData: transformedImports,
          selectedRow: [],
          columnConfiguration: DashboardJson.columnConfiguration,
          gridConfiguration: DashboardJson.gridConfiguration,
        });
        setCurrentPagination({ pageIndex, pageSize });
        setTotalPages(data.countImports.totalPages);
        // setParentGridJson((prev) => ({
        //   ...prev,
        //   gridData: transformedImports,
        // }));
      } catch (error) {
        setIsError("error");
      }

      setIsLoading(false);
    };

    fetchData();
  }, [pageSize, pageIndex, sortedColumn, filterVariable]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {isError}</p>;

  return (
    <div>
      <h1>Imports</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Filename</th>
            <th>Matched</th>
            <th>Status</th>
            <th>Supplier</th>
            <th>Unmatched</th>
            <th>UploadedBy</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {tableStoreData &&
            tableStoreData.gridData.map((row) => (
              <tr key={row.id}>
                <td>{row.Date}</td>
                <td>{row.Filename}</td>
                <td>{row.Matched ? "Yes" : "No"}</td>
                <td>{row.Status}</td>
                <td>{row.Supplier}</td>
                <td>{row.Unmatched ? "Yes" : "No"}</td>
                <td>{row.UploadedBy}</td>
                <td>{row.Source}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Imports;
