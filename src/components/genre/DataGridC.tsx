import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export default function DataGridC() {
  const handleSave = async (event: any, cellValues: any) => {
    try {
      const response = await fetch(`http://localhost:3000/genre/${cellValues.row.id}`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cellValues.row),
        method: 'put',
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
  
  const { data, error, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/genre");
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });
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
            <SaveIcon onClick={(event) => handleSave(event, cellValues)} />
            <CloseIcon sx={{ ml: 1 }} onClick={(event) => handleRemove(event, cellValues)} />
          </>
        );
      },
    },
  ];
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  ("data", data);

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
