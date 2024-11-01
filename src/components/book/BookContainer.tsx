import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ModalBook from "./ModalBook";
import EditIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Save';
import { useState } from "react";
import { Button } from "@mui/material";

export default function BookContainer() {
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [book, setBook] = useState({
    title: '',
    publication_year: '',
    copies_available: '',
    total_copies: '',
    author_id: Number,
    genre_id: Number
  })
  const queryClient = useQueryClient();  // Correct way to access QueryClient

    const { data, error, isLoading } = useQuery({
        queryKey: ["book"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/book");
            if (!response.ok) throw new Error("Failed to fetch books");
            return response.json();
        },
    });
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleEdit = (event: any, cellValues: any) => {
        // console.log(cellValues.row);
        setBook(cellValues.row);
        setOpen(true);
        setEditMode(true);

    }
    const handleRemove = (event: any, cellValues: any) => {
        console.log(cellValues.row.id);
        fetch(`http://localhost:3000/book/${cellValues.row.id}`, {
            method: 'DELETE',
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        queryClient.invalidateQueries(
          {
            queryKey: ['book'],
            refetchType: 'active',
          },
          { throwOnError: true},
        )
    }
    const columns: GridColDef[] = [
        {
          field: 'title',
          editable: false,
          headerName: 'Title',
          width: 200,
        },
        {
          field: 'author_name',
          editable: false,
          headerName: 'Author',
          width: 200,
        },     
        {
            field: 'genre_name',
            editable: false,
            headerName: 'Genre',
            width: 200,
        },     
        // {
        //   field: 'publication_year',
        //   headerName: 'Publication year',
        //   width: 150,
        //   valueFormatter: (params: any) => {
        //     if (!params.value) return '';
        //     return format(new Date(params.value as string), 'dd/MM/yyyy');
        //   },
        // }, 
        {
          field: 'action',
          headerName: 'Action',
          width: 100,
          renderCell: (cellValues) => {
            return (
              <>
                <EditIcon onClick={(event) => handleEdit(event, cellValues)} />
                <CloseIcon sx={{ ml: 1 }} onClick={(event) => handleRemove(event, cellValues)} />
              </>
            );
          },
        },
      ];
    return (
        <>
          <Button onClick={() => setOpen(true)}>Add book</Button>
          <ModalBook 
            open={open} 
            setOpen={setOpen} 
            book={book} 
            setBook={setBook} 
            edit={editMode} setEdit={setEditMode}  
          />
          {/* <ModalBook /> */}
          <DataGrid
              rows={data}  // Pass correctly formatted rows
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
    )
}