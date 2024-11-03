import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface ChildComponentProps {
  data: any;
  setOnedit: (value: number) => void;
}
export default function DataGridC({ data, setOnedit }: ChildComponentProps) {
  console.log("data", data);
  
  const handleSave = async (event: any, cellValues: any) => {
    setOnedit(cellValues.row.id);

    // try {
    //   const response = await fetch(`http://localhost:3000/genre/${cellValues.row.id}`, {
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(cellValues.row),
    //     method: 'put',
    //   });
    //   if (!response.ok) throw new Error('Failed to delete genre');
      
    //   await queryClient.invalidateQueries(
    //     {
    //       queryKey: ['genres'],
    //       refetchType: 'active',
    //     },
    //     { throwOnError: true},
    //   )
    //   alert('Genre updated successfully');
    // } catch (error) {
    //   console.error(error);
    //   alert('Error updating genre: ' + error);
    // }
  };
  const queryClient = useQueryClient();  // Correct way to access QueryClient
  
  const handleRemove = async (event: any,cellValues: any) => {  
    try {
      const response = await fetch(`http://localhost:3000/genre/${cellValues.row.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete genre');
      
      await queryClient.invalidateQueries(
        {
          queryKey: ['genres'],
          refetchType: 'active',
        },
        { throwOnError: true},
      )
      alert('Genre deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Error deleting genre: ' + error);
    }
  };
  
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (cellValues) => {
        return (
          <>
            <SaveIcon sx={{ cursor: 'pointer', m: 1 }} onClick={(event) => handleSave(event, cellValues)} />
            <CloseIcon sx={{ cursor: 'pointer', m: 1 }}  onClick={(event) => handleRemove(event, cellValues)} />
          </>
        );
      },
    },
  ];


  // Ensure data is in the correct format
  const rows = data.map((genre: any) => ({
    id: genre.id,
    name: genre.name,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}  // Pass correctly formatted rows
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
