import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQueryClient } from "@tanstack/react-query";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';


interface ChildComponentProps {
  data: any;
  setOnedit: (value: number) => void;
}
export default function DataGridAuthor({ data, setOnedit }: ChildComponentProps) {
  
  
  const handleSave = async (event: any, cellValues: any) => {
    setOnedit(cellValues.row.id);

  };
  const queryClient = useQueryClient();  // Correct way to access QueryClient
  
  const handleRemove = async (event: any,cellValues: any) => {  
    try {
      const response = await fetch(`http://localhost:3000/author/${cellValues.row.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete author');
      await queryClient.invalidateQueries(
        {
          queryKey: ['authors'],
          refetchType: 'active',
        },
        { throwOnError: true},
      )
      alert('author deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Error deleting author: ' + error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      editable: false,
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'biography',
      editable: false,
      headerName: 'Biography',
      width: 200,
    },     
    {
      field: 'birthday',
      headerName: 'Birthday',
      width: 300,
      // valueFormatter: (params: any) => {
      //   if (!params.value) return '';
      //   return format(new Date(params.value as string), 'dd/MM/yyyy');
      // },
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

  return (
    <Box sx={{ height: 400, width: '100%' }}>
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
    </Box>
  );
}
