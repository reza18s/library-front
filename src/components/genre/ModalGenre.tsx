import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import DataGridC from './DataGridC';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface genreObject {
  name: string
}
export default function ModalGenre() {
  const genreObject = {
    name: ''
};
  const [open, setOpen] = React.useState<boolean>(false);
  const [genreName, setGenreName] = React.useState<genreObject>(genreObject);
  const [onEdit, setOnedit] = React.useState<number>(-1);

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (onEdit === -1) {
      setGenreName({name: ''});
    } else {
      const foundObject = data.find((obj: any) => obj.id === onEdit);
      if (foundObject) {
        setGenreName(foundObject);
      }
    }    
  }, [onEdit]);

  const { data, error, isLoading } = useQuery({
  queryKey: ["genres"],
  queryFn: async () => {
    const response = await fetch("http://localhost:3000/genre");
    if (!response.ok) throw new Error("Failed to fetch genres");
    return response.json();
  },
});
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        onEdit === -1 ? 
          'http://localhost:3000/genre' : 
          `http://localhost:3000/genre/${onEdit}`, {
        method: onEdit === -1 ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genreName),
      });
      if (!response.ok) throw new Error(`Failed to ${onEdit === -1 ? 'add' : 'update'} genre`);
      setGenreName({name: ''});
      await queryClient.invalidateQueries(
        {
          queryKey: ['genres'],
          refetchType: 'active',
        },
        { throwOnError: true},
      )
      alert(`Genre ${onEdit === -1 ? 'added' : 'updated'} successfully`);
    } catch (error) {
      console.error(error);
      alert(`Error ${onEdit === -1 ? 'adding' : 'updating'} genre: ${error}`);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setOnedit(-1);
    setGenreName({name: ''});
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        Genre
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Genre</DialogTitle>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input 
                  autoFocus 
                  required
                  value={genreName.name}
                  onChange={(e) => setGenreName({...genreName, name: e.target.value})} // Update state on input change
                />
              </FormControl>
              <Button disabled={!genreName.name} type="submit">{onEdit === -1 ? 'Add' : 'Update'} new genre</Button>
            </Stack>
          </form>
          <DataGridC data={data} setOnedit={setOnedit} />
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}