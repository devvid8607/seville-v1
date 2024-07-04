"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableComponent from "../uiComponents/TableComponentGlide";
import { canvasIndexGridData } from "../uiComponents/SampleData/canvasIndexGridData";
import {
  GridActionEnum,
  GridFunctionType,
  GridJsonType,
} from "../uiComponents/TableComponentGlide/types";
import useTableStore from "../uiComponents/TableComponentGlide/store/useTableStore";
import { DashboardJson } from "./constants/gridJsonConstants";
import {
  GET_IMPORTS_AND_COUNT,
  ImportsAndCountQueryResult,
} from "../clientlib/GQL/ImportsGQ";
import { useQuery } from "@apollo/client";

interface ImportsProps {
  pageSize: number;
  pageIndex: number;
  sortedColumn: { columnName: string; sortDirection: number };
  filterVariable: string;
}

const SevilleGridPage: React.FC<ImportsProps> = ({
  pageSize,
  pageIndex,
  sortedColumn,
  filterVariable,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [tableStoreData, setTableStoreData] =
    useState<GridJsonType>(DashboardJson);
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

  const gridFunctionProvided: GridFunctionType = (
    action: GridActionEnum,
    data?: any
  ) => {
    switch (action) {
      case GridActionEnum.Edit:
        return alert(`Edit ${data}`);
      case GridActionEnum.Delete:
        return alert("Delete");
      case GridActionEnum.Create:
        return alert("Create");
      case GridActionEnum.Filter:
        return alert("Filter");
      case GridActionEnum.Sorting:
        return alert("Sorting");
      case GridActionEnum.Pagination:
        return alert("Pagination");
      case GridActionEnum.View:
        return alert("View");
      case GridActionEnum.RowSelect:
        return alert("Row select");
      case GridActionEnum.MoreOption:
        return;
      default:
        return alert("Invalid");
    }
  };
  return (
    <div>
      <Box sx={{ height: "55vh", width: "70%" }}>
        <TableComponent
          tableId="test"
          gridJson={tableStoreData}
          gridFunction={gridFunctionProvided}
        />
      </Box>
    </div>
  );
};

export default SevilleGridPage;
