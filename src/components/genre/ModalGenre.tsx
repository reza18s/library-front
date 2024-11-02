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
import { useQueryClient } from '@tanstack/react-query';

interface genreObject {
  name: string
}
export default function ModalGenre() {
  const genreObject = {
    name: ''
};
  const [open, setOpen] = React.useState<boolean>(false);
  const [genreName, setGenreName] = React.useState<genreObject>(genreObject);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genreName),
      });
      if (!response.ok) throw new Error('Failed to add genre');
      setGenreName({name: ''});
      await queryClient.invalidateQueries(
        {
          queryKey: ['genres'],
          refetchType: 'active',
        },
        { throwOnError: true},
      )
      alert('Genre added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding genre');
    }
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
      <Modal open={open} onClose={() => setOpen(false)}>
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
              <Button disabled={!genreName.name} type="submit">Add new genre</Button>
            </Stack>
          </form>
          <DataGridC />
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}