import { useState } from "react";
import {
  Box,
  useTheme,
  SxProps,
  Paper,
  Typography,
  SvgIcon,
  IconButton,
} from "@mui/material";
import {
  ChevronRight,
  ChevronLeft,
  FirstPageOutlined,
  LastPageOutlined,
} from "@mui/icons-material";
import { SelectTextField } from "../../Input/InputField";
import useTableStore from "../store/useTableStore";

interface PaginationComponentProps<T> {
  itemsPerPageOptions: number[];
  tableId: string;
}

const PaginationComponent = ({
  itemsPerPageOptions,
  tableId,
}: PaginationComponentProps<any>) => {
  const theme = useTheme();

  const {
    tables,
    setCurrentPagination,
    setGridData: setTableStoreData,
  } = useTableStore();

  const gridData = tables[tableId];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  // Define number of items per row if you have a grid-like structure
  const itemsPerRow = 1; // Adjust this number as per your grid layout needs
  const totalRowsPerGrid = itemsPerPage; // This could be a simple number like 10 rows per grid.
  const totalItemsPerPage = totalRowsPerGrid * itemsPerRow;

  // const totalPages = Math.ceil(data.length / totalItemsPerPage);
  const totalPages = gridData?.totalPages || 1;
  const startIndex = (currentPage - 1) * totalItemsPerPage;

  // const displayedItems = data.slice(startIndex, endIndex);
  // setData(displayedItems);

  const handlePageSize = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentPagination(tableId, 1, parseInt(e.target.value, 10));
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
    setTableStoreData(tableId, {
      ...gridData.gridJson,
      selectedRow: [],
    });
  };

  const handlePageIndex = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setCurrentPagination(tableId, pageIndex, itemsPerPage);
    setTableStoreData(tableId, {
      ...gridData.gridJson,
      selectedRow: [],
    });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="end" gap={1} py={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>Rows per page:</Typography>

        <SelectTextField
          value={itemsPerPage}
          handleChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
          ) => handlePageSize(e)}
          options={itemsPerPageOptions}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Box>

      <Typography>
        {currentPage.toString()} of {totalPages}
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        sx={{
          ".MuiSvgIcon-root ": {
            color: theme.palette.info.main,
            // color: "white",
            cursor: "pointer",
          },
          ".MuiButtonBase-root": {
            p: 0,
          },
        }}
      >
        <IconButton
          onClick={() => handlePageIndex(1)}
          disabled={currentPage === 1}
        >
          <FirstPageOutlined />
        </IconButton>
        <IconButton
          onClick={() => handlePageIndex(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          sx={{ mr: 1 }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          disabled={currentPage === totalPages}
          onClick={() =>
            handlePageIndex(
              currentPage < totalPages ? currentPage + 1 : totalPages
            )
          }
        >
          <ChevronRight />
        </IconButton>
        <IconButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageIndex(totalPages)}
        >
          <LastPageOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PaginationComponent;
