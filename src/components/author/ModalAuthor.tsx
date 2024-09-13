import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import DataGridAuthor from './DataGridAuthor';

interface authorObject {
  name: string,
  biography: string,
  birthday: string
}
export default function ModalAuthor() {
  const authorObject = {
    name: '',
    biography: '',
    birthday: ''
};
  const [open, setOpen] = React.useState<boolean>(false);
  const [authorName, setAuthorName] = React.useState<authorObject>(authorObject);
  const queryClient = useQueryClient();
  const [onEdit, setOnedit] = React.useState<number>(-1);
  const [filter, setFilter] = React.useState<string>('');
  const [filterData, setFilterData] = React.useState<any>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/author");
      if (!response.ok) throw new Error("Failed to fetch authors");
      return response.json();
    },
  });

  React.useEffect(() => {
    if (onEdit === -1) {
      setAuthorName({
        name: '',
        biography: '',
        birthday: ''
      });
    } else {
      const foundObject = data.find((obj: any) => obj.id === onEdit);
      if (foundObject) {
        setAuthorName(foundObject);
      }
    }    
  }, [onEdit]);
  
  const handleClose = () => {
    setOpen(false);
    setOnedit(-1);
    setFilter('');
    setFilterData(null);
  };
  const handleSubmit = async () => {
    if (onEdit === -1) {
      try {
        const response = await fetch('http://localhost:3000/author', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authorName),
        });
        if (!response.ok) throw new Error('Failed to add author');
        await queryClient.invalidateQueries(
          {
            queryKey: ['authors'],
            refetchType: 'active',
          },
          { throwOnError: true},
        )
        alert('author added successfully');
      } catch (error) {
        console.error(error);
        alert('Error adding author');
      }        
    }
    else {
      try {
        const response = await fetch(`http://localhost:3000/author/${onEdit}`, {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authorName),
          method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to delete author');
        
        await queryClient.invalidateQueries(
          {
            queryKey: ['authors'],
            refetchType: 'active',
          },
          { throwOnError: true},
        )
        setOnedit(-1);
        alert('author deleted successfully');
      } catch (error) {
        console.error(error);
        alert('Error deleting author: ' + error);
      }
    }
    setAuthorName({name: '', biography: '', birthday: ''});
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const filteredNames = data.filter((author: any) => author.name.toLowerCase().startsWith(filter.toLowerCase()));
      setFilterData(filteredNames);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;  
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        Author
      </Button>
      <Modal open={open} onClose={() => handleClose() }>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Author</DialogTitle>
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
                  value={authorName.name}
                  onChange={(e) => setAuthorName({...authorName, name: e.target.value})} // Update state on input change
                />
                <FormLabel>biography</FormLabel>
                <TextField 
                  required
                  value={authorName.biography}
                  multiline
                  rows={4}
                  onChange={(e) => setAuthorName({...authorName, biography: e.target.value})} 
                />
                <FormLabel>birthday</FormLabel>
                <Input 
                  required
                  value={authorName.birthday}
                  type="date"
                  onChange={(e) => setAuthorName({...authorName, birthday: e.target.value})} // Update state on input change
                />
              </FormControl>
              <Button disabled={!authorName.name || !authorName.biography || !authorName.birthday} type="submit">{onEdit === -1 ? 'Add' : 'Update'}</Button>
            </Stack>
          </form>
          <FormLabel>Filter by name</FormLabel>
          <Input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={handleKeyDown}
          />          
          <DataGridAuthor  data={filterData ? filterData : data} setOnedit={setOnedit} />
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}