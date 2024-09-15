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
import { deleteUser, upsertUser } from "./actions";
import {
  Toaster,
  alertToaster,
  toastError,
  toastSuccess,
} from "@/app/utils/toaster";

const initialRows: GridRowsProp = [
  {
    id: "",
    username: "",
    email: "",
    role: "",
  },
];

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
        username: "",
        email: "",
        role: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "username" },
    }));
  };

  return (
    <GridToolbarContainer>
      <button className="btn btn-primary" onClick={handleClick}>
        Add User
      </button>
    </GridToolbarContainer>
  );
}

export default function UserManagementGrid() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`/api/users/`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
    refetchInterval: 10000,
  });

  const [rows, setRows] = useState<GridRowsProp>(initialRows);
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
          const userId = id as string

          await deleteUser({userId});

          setRows(rows.filter((row) => row.id !== id));
          toastSuccess("Deleted");
        } else {
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
    const userData = {
      id: newRow.id,
      username: newRow.username,
      email: newRow.email,
      role: newRow.role,
    };

    const result = await upsertUser({ userData });

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

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 1, editable: true },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={handleSaveClick(id)}
              >
                Save
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={handleCancelClick(id)}
              >
                Cancel
              </button>
            </>,
          ];
        }

        return [
          <>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleEditClick(id)}
            >
              Edit
            </button>
            <button
              disabled={disabledButtonIds.has(id)}
              className="btn-danger btn btn-sm"
              onClick={handleDeleteClick(id)}
            >
              Delete
            </button>
          </>,
        ];
      },
    },
  ];

  return (
    <div className="h-[500px] w-full">
      <Toaster />
      <DataGrid
        rows={rows}
        columns={columns}
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
