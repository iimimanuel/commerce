"use client";

import { useEffect, useState } from "react";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import {
  Toaster,
  alertToaster,
  toastError,
  toastSuccess,
} from "@/app/utils/toaster";
import { upsertCategory } from "./actions"; // You'll need to implement this function as done for products

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 1000).toString();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <button className="btn btn-primary" onClick={handleClick}>
        Add Category
      </button>
    </GridToolbarContainer>
  );
}

export default function CategoryManagementGrid() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`/api/categories/`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
    refetchInterval: 10000,
  });

  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [disabledButtonIds, setDisabledButtonIds] = useState<Set<GridRowId>>(
    new Set(),
  );

  useEffect(() => {
    if (query.data) {
      setRows(query.data);
    }
  }, [query.data]);

  if (query.isLoading)
    return (
      <center>
        <span className="loading-xl loading loading-spinner"></span>
      </center>
    );
  if (query.error) return <div>An error occurred: </div>;

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick =
    (id: GridRowId) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      setDisabledButtonIds((prevDisabledIds) =>
        new Set(prevDisabledIds).add(id),
      );

      try {
        const confirmed = await alertToaster();

        if (confirmed) {
          setRows(rows.filter((row) => row.id !== id));
          toastSuccess("Deleted");
        }
      } catch (error) {
        console.error("Error during deletion:", error);
      } finally {
        setDisabledButtonIds((prevDisabledIds) => {
          const updatedDisabledIds = new Set(prevDisabledIds);
          updatedDisabledIds.delete(id);
          return updatedDisabledIds;
        });
      }
    };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const categoryData = {
      id: newRow.id,
      name: newRow.name,
    };

    const result = await upsertCategory({ categoryData });

    if (result) {
      toastError(result.error.message);
      return;
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );

    toastSuccess("Success");

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const categoryColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <button
              key={`save-${id}`}
              className="btn btn-success btn-sm"
              onClick={handleSaveClick(id)}
            >
              Save
            </button>,
            <button
              key={`cancel-${id}`}
              className="btn btn-error btn-sm"
              onClick={handleCancelClick(id)}
            >
              Cancel
            </button>,
          ];
        }

        return [
          <button
            key={`edit-${id}`}
            className="btn btn-warning btn-sm"
            onClick={handleEditClick(id)}
          >
            Edit
          </button>,
          <button
            key={`delete-${id}`}
            disabled={disabledButtonIds.has(id)}
            className="btn-danger btn btn-sm"
            onClick={handleDeleteClick(id)}
          >
            Delete
          </button>,
        ];
      },
    },
  ];

  return (
    <div className="h-[500px] w-full">
      <Toaster />
      <DataGrid
        rows={rows}
        columns={categoryColumns}
        rowHeight={50}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </div>
  );
}
