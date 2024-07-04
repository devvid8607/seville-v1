// queries.ts
import { gql } from "@apollo/client";

interface Source {
  Id: string;
  Name: string;
}

interface ImportData {
  Date: string;
  Filename: string;
  Matched: boolean;
  Status: string;
  Supplier: string;
  Unmatched: boolean;
  UploadedBy: string;
  Source: Source;
}

interface ImportsQueryResult {
  _id: string;
  Data: ImportData;
}

interface ImportsCount {
  totalPages: number;
  totalResults: number;
}

export interface ImportsAndCountQueryResult {
  Imports: ImportsQueryResult[];
  countImports: ImportsCount;
}

export const GET_IMPORTS_AND_COUNT = gql`
  query GetImportsAndCount(
    $filter: String
    $sort: String
    $pageIndex: Int
    $pageSize: Int
  ) {
    Imports(
      filter: $filter
      sort: $sort
      pageIndex: $pageIndex
      pageSize: $pageSize
    ) {
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
`;
