import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ModalBook from "./ModalBook";
import EditIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@mui/material";

interface Book {
  id: number;
  title: string;
  publication_year: string;
  copies_available: string;
  total_copies: string;
  author_id: number | null; // Assuming id could be null if not set
  genre_id: number | null; // Assuming id could be null if not set
  author_name?: string; // Optional for display
  genre_name?: string; // Optional for display
}

export default function DataGridAuthor() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [book, setBook] = useState<Book>({
    id: 0, // Default id; adjust based on your needs
    title: '',
    publication_year: '',
    copies_available: '',
    total_copies: '',
    author_id: null,
    genre_id: null,
  });

  const { data: books = [], error, isLoading } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/book");
      if (!response.ok) throw new Error("Failed to fetch books");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleEdit = (event: any, cellValues: any) => {
    setBook(cellValues.row);
    setOpen(true);
    setEditMode(true);
  };

  const handleRemove = async (event: any, cellValues: any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3000/book/${cellValues.row.id}`, {
        method: 'DELETE',
      });
      alert('Successfully deleted book');
      queryClient.invalidateQueries({
        queryKey: ['books']
      }); // Refetch after deletion
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting book. Please try again.');
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'author_name', headerName: 'Author', width: 200 },
    { field: 'genre_name', headerName: 'Genre', width: 200 },
    { field: 'publication_year', headerName: 'Publication Year', width: 300 },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (cellValues) => (
        <>
          <EditIcon onClick={(event) => handleEdit(event, cellValues)} />
          <CloseIcon sx={{ ml: 1 }} onClick={(event) => handleRemove(event, cellValues)} />
        </>
      ),
    },
  ];

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>Add Book</Button>
      <ModalBook 
        open={open} 
        setOpen={setOpen} 
        book={book} 
        setBook={setBook} 
        isEdit={editMode} 
        setEdit={setEditMode} 
      />
      <DataGrid
        rows={books} // Pass correctly formatted rows
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </>
  );
}
