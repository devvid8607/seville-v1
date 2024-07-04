// app/imports/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_IMPORTS_AND_COUNT,
  ImportsAndCountQueryResult,
} from "../clientlib/GQL/ImportsGQ";
import { GridJsonType } from "../uiComponents/TableComponentGlide/types";
import { DashboardJson } from "../sevilleGrid/constants/gridJsonConstants";

interface ImportsProps {
  pageSize: number;
  pageIndex: number;
  sortedColumn: { columnName: string; sortDirection: number };
  filterVariable: string;
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
  const [parentGridJson, setParentGridJson] =
    useState<GridJsonType>(DashboardJson);

  const { loading, error, data, refetch } =
    useQuery<ImportsAndCountQueryResult>(GET_IMPORTS_AND_COUNT, {
      variables: {
        pageSize,
        pageIndex,

        filter: filterVariable,
      },
    });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    if (error) {
      setIsError(error.message);
    } else if (data) {
      const transformedImports = data.Imports.map((importItem) => ({
        id: importItem._id,
        Date: importItem.Data.Date,
        Filename: importItem.Data.Filename,
        Matched: importItem.Data.Matched,
        Status: importItem.Data.Status,
        Supplier: importItem.Data.Supplier,
        Unmatched: importItem.Data.Unmatched,
        UploadedBy: importItem.Data.UploadedBy,
        Source: importItem.Data.Source.Name,
      }));

      setTableStoreData({
        gridData: transformedImports,
        selectedRow: [],
        columnConfiguration: DashboardJson.columnConfiguration,
        gridConfiguration: DashboardJson.gridConfiguration,
      });
      setCurrentPagination({ pageIndex, pageSize });
      setTotalPages(data.countImports.totalPages);
      setParentGridJson((prev) => ({
        ...prev,
        gridData: transformedImports,
      }));
    }
  }, [loading, error, data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
