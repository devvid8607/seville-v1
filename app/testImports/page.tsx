"use client";
export interface Source {
  Id: string;
  Name: string;
}

export interface ImportData {
  Date: string;
  Filename: string;
  Matched: boolean;
  Status: string;
  Supplier: string;
  Unmatched: boolean;
  UploadedBy: string;
  Source: Source;
}

export interface ImportItem {
  _id: string;
  Data: ImportData;
}

export interface ImportsCount {
  totalPages: number;
  totalResults: number;
}

export interface ImportsAndCountQueryResult {
  Imports: ImportItem[];
  countImports: ImportsCount;
}

export interface GridJsonType {
  gridData: any[];
  selectedRow: any[];
  columnConfiguration: any;
  gridConfiguration: any;
}

// import React, { useState, useEffect } from "react";
// import fetchGraphQL from "../gqlAxiosTest/fetchImports";

// import { DashboardJson } from "../sevilleGrid/constants/gridJsonConstants";

// const TestImportsQuery: React.FC = () => {
//   const [sort, setSort] = useState<string | null>(null);
//   const [filter, setFilter] = useState<string | null>(null);
//   const [pageIndex, setPageIndex] = useState<number | null>(1); // Default to 1
//   const [pageSize, setPageSize] = useState<number | null>(10); // Default to 10
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState<string | null>(null);
//   const [tableStoreData, setTableStoreData] = useState<GridJsonType | null>(
//     null
//   );
//   const [totalPages, setTotalPages] = useState(0);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault(); // Prevent the default form submission behavior
//     setIsLoading(true);
//     setIsError(null);

//     try {
//       const data = await fetchGraphQL<ImportsAndCountQueryResult>(
//         `query GetImportsAndCount($filter: String, $sort: String, $pageIndex: Int, $pageSize: Int) {
//           Imports(filter: $filter, sort: $sort, pageIndex: $pageIndex, pageSize: $pageSize) {
//             _id
//             Data {
//               Date
//               Filename
//               Matched
//               Status
//               Supplier
//               Unmatched
//               UploadedBy
//               Source {
//                 Id
//                 Name
//               }
//             }
//           }
//           countImports(pageSize: $pageSize, filter: $filter) {
//             totalPages
//             totalResults
//           }
//         }`,
//         {
//           filter,
//           sort,
//           pageIndex,
//           pageSize,
//         }
//       );

//       const transformedImports = data.Imports.map((importItem: ImportItem) => ({
//         id: importItem._id,
//         Date: importItem.Data.Date,
//         Filename: importItem.Data.Filename,
//         Matched: importItem.Data.Matched,
//         Status: importItem.Data.Status,
//         Supplier: importItem.Data.Supplier,
//         Unmatched: importItem.Data.Unmatched,
//         UploadedBy: importItem.Data.UploadedBy,
//         Source: importItem.Data.Source.Name,
//       }));

//       setTableStoreData({
//         gridData: transformedImports,
//         selectedRow: [],
//         columnConfiguration: DashboardJson.columnConfiguration,
//         gridConfiguration: DashboardJson.gridConfiguration,
//       });
//       setTotalPages(data.countImports.totalPages);
//     } catch (error) {
//       setIsError("Failed to fetch data");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div>
//       <h1>Imports</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Filter:
//           <input
//             type="text"
//             value={filter || ""}
//             onChange={(e) => setFilter(e.target.value)}
//           />
//         </label>
//         <label>
//           Sort:
//           <input
//             type="text"
//             value={sort || ""}
//             onChange={(e) => setSort(e.target.value)}
//           />
//         </label>
//         <label>
//           Page Index:
//           <input
//             type="number"
//             value={pageIndex || ""}
//             onChange={(e) => setPageIndex(Number(e.target.value))}
//           />
//         </label>
//         <label>
//           Page Size:
//           <input
//             type="number"
//             value={pageSize || ""}
//             onChange={(e) => setPageSize(Number(e.target.value))}
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//       {isLoading && <p>Loading...</p>}
//       {isError && <p>Error: {isError}</p>}
//       <ul style={{ margin: 12 }}>
//         {tableStoreData &&
//           tableStoreData.gridData.map((row, index) => (
//             <li key={index}>
//               {row.Date} - {row.Filename} -{" "}
//               {row.Matched ? "Matched" : "Unmatched"} - {row.Status} -{" "}
//               {row.Supplier} - {row.UploadedBy} - {row.Source}
//             </li>
//           ))}
//       </ul>
//       <div>
//         Page {pageIndex} of {totalPages}
//       </div>
//     </div>
//   );
// };

// export default TestImportsQuery;

import React, { useState } from "react";
import useFetch from "../_lib/_hooks/useFetch";
import handleNetworkStatus from "../_lib/_utils/handleAxiosStatus";
import { useRouter } from "next/navigation";

const TestImportsQuery: React.FC = () => {
  const router = useRouter();
  const [sort, setSort] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number | null>(1);
  const [pageSize, setPageSize] = useState<number | null>(10);

  const { data, error, status, loading, sendRequest } =
    useFetch<ImportsAndCountQueryResult>("/api/gqlApis");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    sendRequest(
      "POST",
      null,
      true,
      `query GetImportsAndCount($filter: String, $sort: String, $pageIndex: Int, $pageSize: Int) {
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
        }`,
      { filter, sort, pageIndex, pageSize }
    );
  };

  const transformedImports =
    data?.Imports.map((importItem: ImportItem) => ({
      id: importItem._id,
      Date: importItem.Data.Date,
      Filename: importItem.Data.Filename,
      Matched: importItem.Data.Matched,
      Status: importItem.Data.Status,
      Supplier: importItem.Data.Supplier,
      Unmatched: importItem.Data.Unmatched,
      UploadedBy: importItem.Data.UploadedBy,
      Source: importItem.Data.Source.Name,
    })) || [];

  const totalPages = data?.countImports.totalPages || 0;

  if (error && (status === 401 || status === 400)) {
    return handleNetworkStatus(status, router.push);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching imports: {error}</p>;
  }

  return (
    <div>
      <h1>Imports</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Filter:
          <input
            type="text"
            value={filter || ""}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
        <label>
          Sort:
          <input
            type="text"
            value={sort || ""}
            onChange={(e) => setSort(e.target.value)}
          />
        </label>
        <label>
          Page Index:
          <input
            type="number"
            value={pageIndex || ""}
            onChange={(e) => setPageIndex(Number(e.target.value))}
          />
        </label>
        <label>
          Page Size:
          <input
            type="number"
            value={pageSize || ""}
            onChange={(e) => setPageSize(Number(e.target.value))}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul style={{ margin: 12 }}>
        {transformedImports.map((row, index) => (
          <li key={index}>
            {row.Date} - {row.Filename} -{" "}
            {row.Matched ? "Matched" : "Unmatched"} - {row.Status} -{" "}
            {row.Supplier} - {row.UploadedBy} - {row.Source}
          </li>
        ))}
      </ul>
      <div>
        Page {pageIndex} of {totalPages}
      </div>
    </div>
  );
};

export default TestImportsQuery;
