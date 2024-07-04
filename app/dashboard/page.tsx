"use client";
import React from "react";
import TableComponent from "../uiComponents/TableComponentGlide";
import { canvasIndexGridData } from "../uiComponents/SampleData/canvasIndexGridData";
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";

const Dashboardpage = () => {
  const data = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Jane", lastName: "Smith" },
    { firstName: "Alice", lastName: "Johnson" },
    { firstName: "Bob", lastName: "Brown" },
  ];
  const numRows = data.length;
  function getData([col, row]: Item): GridCell {
    const person = data[row];

    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        data: person.firstName,
        allowOverlay: false,
        displayData: person.firstName,
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Text,
        data: person.lastName,
        allowOverlay: false,
        displayData: person.lastName,
      };
    } else {
      throw new Error();
    }
  }
  const columns: GridColumn[] = [
    { title: "First Name", width: 100 },
    { title: "Last Name", width: 100 },
  ];
  return (
    <div>
      <DataEditor getCellContent={getData} columns={columns} rows={numRows} />
    </div>
  );
};

export default Dashboardpage;
