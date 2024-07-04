import { useCallback, useState, useEffect } from "react";
import DataEditor, {
  DataEditorProps,
  GetRowThemeCallback,
  Rectangle,
  Item,
  CellClickedEventArgs,
  HeaderClickedEventArgs,
  SpriteMap,
  GridMouseEventArgs,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { Box } from "@mui/material";
import { useEventListener } from "./common/utils";
import { allCells } from "./cells";
import {
  GridFunctionType,
  GridJsonType,
  GridActionEnum,
  SortedColumnType,
} from "./types";
import { useGridFunction } from "./utils";
import { TooltipComponent, PaginationComponent } from "./components";
import MenuComponent from "../Menu/MenuComponent";
import { createPortal } from "react-dom";
import { useDebounce } from "../hooks/UseDebounce";
import {
  MakeDefaultAndVisiblecColumnConfig,
  makeDefaultColumn,
  makeDefaultColumnConfig,
  updateColumnConfig,
} from "./common";
import useTableStore from "./store/useTableStore";

interface TableComponentProps {
  gridJson: GridJsonType;
  gridFunction?: GridFunctionType;
  handleOpenColumnConfig?: () => void;
  tableId: string;
}

const TableComponent: React.FC<TableComponentProps> = ({
  gridJson,
  gridFunction,
  handleOpenColumnConfig,
  tableId = "",
}) => {
  const {
    tables,
    setSortedColumn: setStoreSortedColumn,
    setGridData: setTableStoreData,
    setCurrentPagination,
    setTotalPages,
  } = useTableStore();
  const sortedColumn = tables[tableId]?.sortedColumn || {
    columnName: MakeDefaultAndVisiblecColumnConfig(
      gridJson.columnConfiguration
    )[0].id,
    sortDirection: "1",
  };

  const defaultProps: Partial<DataEditorProps> = {
    smoothScrollX: true,
    smoothScrollY: true,
  };

  //#region -----Sorting---------

  const [headerMenu, setHeaderMenu] = useState<null | HTMLElement>(null);

  function isHeaderTitleAvailable(gridJson: GridJsonType, colIndex: number) {
    const updatedGridJson = updateColumnConfig(
      gridJson
    ).columnConfiguration.filter((item) => item.isVisible);
    console.log(updatedGridJson);
    return updatedGridJson[colIndex] !== undefined;
  }

  const onHeaderMenuClick = useCallback(
    (col: number, _event: HeaderClickedEventArgs) => {
      const clickedColumnId = MakeDefaultAndVisiblecColumnConfig(
        gridJson.columnConfiguration
      )[col].id;

      if (isHeaderTitleAvailable(gridJson, col)) {
        if (sortedColumn && sortedColumn.columnName === clickedColumnId) {
          setStoreSortedColumn(
            tableId,
            clickedColumnId,
            sortedColumn?.sortDirection === "1" ? "-1" : "1"
          );
          // setCurrentPagination(tableId, 1, 20);
          // setTotalPages(tableId, tables[tableId].currentPageSize)
        } else {
          setStoreSortedColumn(tableId, clickedColumnId, "1");
        }
      }
    },
    [gridJson, sortedColumn]
  );

  //#endregion

  //#region ------ Required Glide Grid Functions/Props -------
  const {
    getCellContent,
    setCellValue,
    onColumnResize,
    onColMoved,
    reorderRows,
    // originalColumnConfig,
    gridColumn,
    gridData,
    rowHeight,
    isTooltip,
    isDraggableRow,
    isVerticalBorder,
    isResizableColumn,
    isDraggableColumn,
    isRowSelectable,
    isSorting,
    isSearchable,
    isPagination,
    isFreezeColumn,
    isFreezeRow,
    onGroupNameChange,
    isGroupNameEditable,
    onRowAppended,
    numRows,
    setNumRows,
    isRowAppended,
    isFillHandle,
    onGroupHeaderClicked,
    gridRef,
    showSearch,
    setShowSearch,
    gridSelection,
    onGridSelectionChange,
    undo,
    canRedo,
    canUndo,
    redo,
    canUndoRedo,
    isRowHovered,
    isCellSelectable,
    isContextMenu,
    isHeaderContextMenu,
    headerIcons,
    isFixedGrid,
  } = useGridFunction({
    gridJson: gridJson,
    sortedIndex: sortedColumn,
    gridFunction,
    tableId: tableId,
  });

  //#endregion

  //#region ------ Pagination Section --------

  //#endregion

  //#region -----Hover Section--------

  const [tooltip, setTooltip] = useState<
    | {
        title: string;
        description: string;
      }
    | string
  >("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const debouncedTooltipAnchorEl = useDebounce(anchorEl, 1000);

  const onItemHovered = (args: any) => {
    // Create a virtual element and position it based on args.bounds
    const virtualElement = {
      getBoundingClientRect: () => ({
        top: args.bounds.y + args.localEventY - 5,
        left: args.bounds.x + args.localEventX,
        bottom: args.bounds.y + args.localEventY,
        right: args.bounds.x + args.localEventX + 10,
        width: 10,
        height: 10,
      }),
    };

    if (args.kind === "header") {
      const columnConfig = makeDefaultColumnConfig(
        gridJson.columnConfiguration
      );
      const hoveredColumn = columnConfig[args.location[0]];

      if (isTooltip) {
        setAnchorEl(virtualElement as unknown as HTMLElement);
        setTooltip({
          title: hoveredColumn.title,
          description: hoveredColumn.description || "",
        });
      }
    } else if (args.kind === "cell" && args.location[1] < numRows) {
      const cellContent = getCellContent(args.location);

      if (cellContent.kind === "number" || cellContent.kind === "text") {
        // Check if the row should be hovered or not
        setHoverRow(isRowHovered ? args.location[1] : undefined);

        if (isTooltip) {
          setAnchorEl(virtualElement as unknown as HTMLElement);
          setTooltip(
            cellContent.data !== undefined ? cellContent.data.toString() : ""
          );
        } else {
          setAnchorEl(null);
          setTooltip("");
        }
      }
    } else {
      // Reset everything if the hovered item is not a valid cell
      setAnchorEl(null);
      setTooltip("");
      setHoverRow(undefined);
    }
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Effect to handle tooltip visibility
  useEffect(() => {
    if (anchorEl !== null || tooltip !== null) {
      setTimeout(() => {
        setTooltipVisible(true);
      }, 1500);
    } else {
      setTooltipVisible(false);
    }

    return () => {
      setTooltipVisible(false);
    };
  }, [anchorEl, tooltip]);

  const [hoverRow, setHoverRow] = useState<number | undefined>(undefined);

  const getRowThemeOverride = useCallback<GetRowThemeCallback>(
    (row) => {
      if (row !== hoverRow) return undefined;
      return {
        bgCell: "#f7f7f7",
        bgCellMedium: "#f0f0f0",
      };
    },
    [hoverRow]
  );

  //#endregion

  //#region ------ Context Menu Section -----------
  const [rowMenu, setRowMenu] = useState<null | HTMLElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    col: string;
    row: string;
  } | null>(null);

  const onRowMenuClick = useCallback(
    (cell: Item, event: CellClickedEventArgs) => {
      const [col, row] = cell;
      event.preventDefault();
      const { bounds } = event;
      if (col > 0) {
        setContextMenu({
          col: `${col}`,
          row: `${row}`,
        });
        const virtualElement = {
          getBoundingClientRect: () =>
            ({
              top: bounds.y + 2 * bounds.height,
              left: bounds.x,
              bottom: bounds.y + bounds.height,
              right: bounds.x + bounds.width,
              width: bounds.width,
              height: bounds.height,
            } as DOMRect),
          nodeType: Node.ELEMENT_NODE,
        };
        setRowMenu(virtualElement as unknown as HTMLElement);
      }
    },
    []
  );

  //#endregion

  //#region ------ Header Context Section -------
  const [headerContextMenu, setHeaderContextMenu] =
    useState<null | HTMLElement>(null);

  const onHeaderContextMenuClick = useCallback(
    (_cell: number, event: HeaderClickedEventArgs) => {
      event.preventDefault();
      const { bounds } = event;

      const virtualElement = {
        getBoundingClientRect: () =>
          ({
            top: bounds.y + bounds.height,
            left: bounds.x,
            bottom: bounds.y + bounds.height,
            right: bounds.x + bounds.width,
            width: bounds.width,
            height: bounds.height,
          } as DOMRect),
        nodeType: Node.ELEMENT_NODE,
      };
      setHeaderContextMenu(virtualElement as unknown as HTMLElement);
    },
    []
  );
  //#endregion

  const mainTheme = {
    accentColor: "#4F5DFF",
    accentFg: "#FFFFFF",
    accentLight: "rgba(62, 116, 253, 0.1)",

    textDark: "#313139",
    textMedium: "#737383",
    textLight: "#B2B2C0",
    textBubble: "#313139",

    bgIconHeader: "#737383",
    fgIconHeader: "#FFFFFF",
    textHeader: "#313139",
    textGroupHeader: "#313139BB",
    textHeaderSelected: "#FFFFFF",

    bgCell: "#FFFFFF",
    bgCellMedium: "#FAFAFB",
    bgHeader: "#F7F7F8",
    bgHeaderHasFocus: "#E9E9EB",
    bgHeaderHovered: "#EFEFF1",

    bgBubble: "#EDEDF3",
    bgBubbleSelected: "#FFFFFF",

    bgSearchResult: "#fff9e3",

    borderColor: "rgba(115, 116, 131, 0.16)",
    drilldownBorder: "rgba(0, 0, 0, 0)",

    linkColor: "#353fb5",

    cellHorizontalPadding: 8,
    cellVerticalPadding: 3,

    headerIconSize: 16,

    headerFontStyle: "600 13px",
    baseFontStyle: "11px",
    markerFontStyle: "9px",
    fontFamily: "Wix Madefor Text, sans-serif",
    editorFontSize: "13px",
    lineHeight: 1.4, //unitless scaler depends on your font
  };

  useEventListener(
    "keydown",
    useCallback(
      (event) => {
        if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
          setShowSearch((cv) => (isSearchable ? !cv : false));
          event.stopPropagation();
          event.preventDefault();
        }
      },
      [setShowSearch, isSearchable]
    ),
    window,
    false,
    true
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (canUndoRedo && e.key === "z" && (e.metaKey || e.ctrlKey)) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (canUndoRedo && e.key === "y" && (e.metaKey || e.ctrlKey)) {
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [undo, redo, canUndoRedo]);

  useEffect(() => {
    setTimeout(() => {
      const elementsWithScroll =
        document.querySelectorAll<HTMLDivElement>(".dvn-scroller");

      elementsWithScroll.forEach((el) => {
        el.classList.add("custom-scrollbar"); // Apply custom scrollbar styles
      });
    }, 1);
  }, []);

  function handleCellClick(
    cell: Item,
    event: CellClickedEventArgs
  ): void | undefined {
    const cellContent = getCellContent(cell);

    function isMoreCell(data: any): boolean {
      return data && data.icon === "more_vert_icon";
    }

    if (
      cellContent.kind === "custom" &&
      isMoreCell(cellContent.data) &&
      gridFunction
    ) {
      return gridFunction(GridActionEnum.MoreOption, event);
    }

    return undefined;
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box className="custom-scrollbar" sx={{ flexGrow: 1 }}>
        <DataEditor
          {...defaultProps}
          getCellContent={getCellContent}
          // columns={makeDefaultColumn(
          //   originalColumnConfig,
          //   false,
          //   true,
          //   isSorting,
          //   sortedColumnIndex || 0
          // )}
          columns={gridColumn}
          headerIcons={headerIcons}
          rowMarkers={isRowSelectable ? "checkbox-visible" : "none"}
          onCellEdited={setCellValue}
          trailingRowOptions={{
            hint: "New row...",
            sticky: true,
            tint: true,
          }}
          rows={numRows}
          onRowAppended={isRowAppended ? onRowAppended : undefined}
          onColumnResize={isResizableColumn ? onColumnResize : undefined}
          onItemHovered={onItemHovered}
          getRowThemeOverride={getRowThemeOverride}
          // onHeaderMenuClick={isSorting ? onHeaderMenuClick : undefined}
          onHeaderContextMenu={
            isHeaderContextMenu
              ? (colIndex, event) => {
                  onHeaderContextMenuClick(colIndex, event);
                }
              : undefined
          }
          onHeaderClicked={onHeaderMenuClick}
          onGroupHeaderClicked={onGroupHeaderClicked}
          customRenderers={allCells}
          verticalBorder={isVerticalBorder}
          onColumnMoved={isDraggableColumn ? onColMoved : undefined}
          width="100%"
          // height={isFixedGrid ? "85%" : undefined}
          height="100%"
          minColumnWidth={10}
          onRowMoved={isDraggableRow ? reorderRows : undefined}
          showSearch={showSearch}
          onSearchClose={() => setShowSearch(false)}
          gridSelection={
            isCellSelectable
              ? gridSelection
                ? gridSelection
                : undefined
              : undefined
          }
          onGridSelectionChange={onGridSelectionChange}
          getCellsForSelection={isCellSelectable ? true : undefined}
          rowHeight={rowHeight}
          experimental={{
            hyperWrapping: true,
          }}
          freezeColumns={isFreezeColumn ? isFreezeColumn : undefined}
          // freezeColumns={gridColumn.length}
          freezeTrailingRows={isFreezeRow ? isFreezeRow : undefined}
          onPaste={true}
          fillHandle={isFillHandle}
          keybindings={{
            downFill: true,
            goUpCell: true,
            rightFill: true,
            goLeftCell: true,
          }}
          ref={gridRef}
          onCellContextMenu={isContextMenu ? onRowMenuClick : undefined}
          onCellClicked={handleCellClick}
          theme={mainTheme}
        />
        {tooltipVisible && (
          <TooltipComponent
            content={tooltip}
            anchorEl={debouncedTooltipAnchorEl}
          />
        )}
        <MenuComponent
          open={Boolean(headerMenu)}
          onClose={() => setHeaderMenu(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          anchorEl={headerMenu}
          items={[
            { label: "Sort Ascending", onClick: () => alert("Hello") },
            { label: "Sort Descending", onClick: () => alert("Hello") },
          ]}
        />
        <MenuComponent
          open={Boolean(rowMenu)}
          onClose={() => setRowMenu(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          anchorEl={rowMenu}
          items={[
            {
              label: contextMenu ? `Col: ${contextMenu.col}` : "",
              onClick: () => alert("Hello"),
            },
            {
              label: contextMenu ? `Row: ${contextMenu.row}` : "",
              onClick: () => alert("Hello"),
            },
          ]}
        />
        {handleOpenColumnConfig && (
          <MenuComponent
            open={Boolean(headerContextMenu)}
            onClose={() => setHeaderContextMenu(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            anchorEl={headerContextMenu}
            items={[
              {
                label: "Manage Column",
                onClick: () => handleOpenColumnConfig(),
              },
            ]}
          />
        )}
      </Box>

      {isPagination && (
        <PaginationComponent
          itemsPerPageOptions={[20, 50, 100]}
          tableId={tableId}
        />
      )}

      {createPortal(
        <div
          id="portal"
          style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }}
        />,
        document.body
      )}
    </Box>
  );
};

export default TableComponent;
