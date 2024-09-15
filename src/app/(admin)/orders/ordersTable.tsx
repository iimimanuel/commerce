"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
  { field: "email", headerName: "Email", flex: 3 },
  { field: "role", headerName: "Role", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 2,
    renderCell: (params: any) => (
      <div className="flex space-x-2">
        {/* Uncomment and modify the Edit button as needed */}
        {/* <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </Button> */}
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

const rows = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];

const handleEdit = (id: number) => {
  console.log(`Edit row with id ${id}`);
};

const handleDelete = (id: number) => {
  console.log(`Delete row with id ${id}`);
};

export default function OrderTable() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
