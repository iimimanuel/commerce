"use client";

import { useEffect, useRef, useState } from "react";
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
  GridRenderEditCellParams,
  GridSlots,
  GridRowEditStopReasons,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toastError, toastSuccess } from "@/app/utils/toaster";
import { upsertVariant } from "./actions";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  productId: string;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, productId } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 1000).toString();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        productId,
        name: "",
        price: 0,
        stock: 0,
        images: [],
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
        Add Variant
      </button>
    </GridToolbarContainer>
  );
}

export default function VariantManagementGrid() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [disabledButtonIds, setDisabledButtonIds] = useState<Set<GridRowId>>(
    new Set(),
  );
  const [productId, setProductId] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterModel, setFilterModel] = useState<any>({
    items: [
      {
        field: "productId",
        operator: "equals",
        value: "xxxxxxx",
      },
    ],
  });

  const variantsQuery = useQuery({
    queryKey: ["variants"],
    queryFn: async () => {
      const res = await fetch(`/api/variants`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (variantsQuery.data) {
      setRows(variantsQuery.data);
    }
  }, [variantsQuery.data]);

  if (variantsQuery.isLoading)
    return (
      <center>
        <span className="loading-xl loading loading-spinner"></span>
      </center>
    );
  if (variantsQuery.error) return <div>An error occurred: </div>;

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
        const confirmed = window.confirm(
          "Are you sure you want to delete this variant?",
        );

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
    const images =
      typeof newRow.images === "string"
        ? newRow.images.split(",")
        : newRow.images;

    const variantData = {
      id: newRow.id,
      productId,
      name: newRow.name,
      price: newRow.price,
      stock: newRow.stock,
      images: images,
    };

    const result = await upsertVariant({ variantData });

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

  const handleSearch = async () => {
    if (inputRef.current && inputRef.current.value !== "") {
      setFilterModel({
        items: [
          {
            field: "productId",
            operator: "equals",
            value: inputRef.current.value,
          },
        ],
      });

      await setProductId(inputRef.current.value);
    }
  };

  const variantColumns: GridColDef[] = [
    { field: "id", headerName: "Id", flex: 1, editable: true },
    { field: "productId", headerName: "Product Id", flex: 1, editable: true },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      editable: true,
      type: "number",
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      editable: true,
      type: "number",
    },
    {
      field: "images",
      headerName: "Images",
      flex: 2,
      editable: true,
      renderCell: (params) => {
        const imageUrls = Array.isArray(params.value) ? params.value : [];

        return (
          <div className="flex h-full w-full items-center space-x-2">
            {imageUrls.length > 0 ? (
              imageUrls.map((imgUrl: string, index: number) => (
                <Image
                  height={1000}
                  key={index}
                  src={imgUrl}
                  width={1000}
                  alt={`Variant Image ${index}`}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ))
            ) : (
              <span>No images available</span>
            )}
          </div>
        );
      },
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
    <>
      <div className="mb-4 flex items-center space-x-2">
        <label
          htmlFor="searchId"
          className="block text-sm font-medium text-gray-700"
        >
          Search Variant by ID
        </label>
        <input
          type="text"
          id="searchId"
          ref={inputRef}
          placeholder="Enter variant ID"
          className="mt-1 block h-[30px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          onClick={() => {
            handleSearch();
          }}
          className="btn btn-primary mt-2"
        >
          Search
        </button>
      </div>
      <div className="h-[400px] w-full">
        <DataGrid
          className="h-[200px]"
          rows={rows}
          columns={variantColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          filterModel={filterModel}
          slots={{
            toolbar: EditToolbar as GridSlots["toolbar"],
          }}
          slotProps={{
            toolbar: {
              setRows,
              setRowModesModel,
              productId,
            } as GridSlotsComponentsProps["toolbar"],
          }}
          disableColumnFilter
        />
      </div>
    </>
  );
}
