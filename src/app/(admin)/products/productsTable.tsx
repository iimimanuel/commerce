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
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import {
  Toaster,
  alertToaster,
  toastError,
  toastSuccess,
} from "@/app/utils/toaster";
import { deleteProduct, upsertProduct } from "./actions";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Option {
  value: string;
  label: string;
}

function MultiSelectEditComponent({
  props,
  options,
}: {
  props: GridRenderEditCellParams;
  options: Option[];
}) {
  const { id, field, api, value } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>(
    (value || []).map((v: { id: string; name: string }) => v.id),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: optionValue, checked } = event.target;
    let newValue: string[];

    if (checked) {
      newValue = [...selectedValues, optionValue];
    } else {
      newValue = selectedValues.filter((val) => val !== optionValue);
    }

    setSelectedValues(newValue);
    const updatedValue = newValue.map((id) => {
      const option = options.find((o) => o.value === id);
      return { id, name: option ? option.label : "" };
    });

    // Update the grid state
    api.setEditCellValue({ id, field, value: updatedValue });
  };

  console.log(selectedValues);

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <label key={option.value} className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={handleChange}
          />

          <span className="label-text ml-2">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex h-full flex-col">
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        }}
      />
    </div>
  );
};

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
        description: "",
        price: 0,
        images: [],
        variants: [],
        categories: [],
        isActive: false,
        stock: 0,
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
        Add Product
      </button>
    </GridToolbarContainer>
  );
}

export default function ProductManagementGrid() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`/api/products/`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
    refetchInterval: 10000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`/api/categories/`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
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
          const productId = id as string;
          await deleteProduct({ productId });
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
    const productData = {
      id: newRow.id,
      name: newRow.name,
      description: newRow.description,
      categories: newRow.categories,
      isActive: newRow.isActive,
      stock: newRow.stock,
    };

    const result = await upsertProduct({ productData });

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

  const categoryOptions = categoriesQuery.data?.map(
    (category: { id: string; name: string }) => ({
      value: category.id,
      label: category.name,
    }),
  );

  const productColumns: GridColDef[] = [
    { field: "id", headerName: "Id", flex: 1, editable: true },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        const handleChange = (value: string) => {
          params.api.setEditCellValue(
            { id: params.id, field: params.field, value },
            params,
          );
        };

        return (
          <div className="z-30 h-full w-full overflow-auto">
            <RichTextEditor
              value={params.value || ""}
              onChange={handleChange}
            />
          </div>
        );
      },
    },
    {
      field: "categories",
      headerName: "Categories",
      flex: 1,
      editable: true,
      renderCell: (params) => {
        const categories = Array.isArray(params.value) ? params.value : [];

        return (
          <div className="flex h-full w-full items-center space-x-2">
            {categories.length > 0 ? (
              categories.map((category: any, index: number) => (
                <>{category.name}-</>
              ))
            ) : (
              <span>No Categories Selected</span>
            )}
          </div>
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <MultiSelectEditComponent props={params} options={categoryOptions} />
      ),
    },
    {
      field: "isActive",
      headerName: "Is Active",
      flex: 1,
      editable: true,
      type: "boolean",
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
    <div className="h-[500px] w-full">
      <Toaster />
      <DataGrid
        rows={rows}
        columns={productColumns}
        rowHeight={200}
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
