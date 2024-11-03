import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import DataGridAuthor from './DataGridAuthor';


interface Author {
  id?: number;
  name: string;
  biography: string;
  birthday: string;
}

const fetchAuthors = async (): Promise<Author[]> => {
  const response = await fetch("http://localhost:3000/author");
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
};

const addOrUpdateAuthor = async (author: Author, onEdit: number) => {
  const response = await fetch(
    onEdit === -1 ? 'http://localhost:3000/author' : `http://localhost:3000/author/${onEdit}`, 
    {
      method: onEdit === -1 ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    }
  );
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || "Failed to update author");
  }
};

export default function ModalAuthor() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [author, setAuthor] = React.useState<Author>({ name: '', biography: '', birthday: '' });
  const [onEdit, setOnEdit] = React.useState<number>(-1);
  const [filter, setFilter] = React.useState<string>('');
  const [filterData, setFilterData] = React.useState<Author[] | null>(null);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  React.useEffect(() => {
    if (onEdit === -1) {
      setAuthor({ name: '', biography: '', birthday: '' });
    } else {
      const foundAuthor = data?.find((obj) => obj.id === onEdit);
      if (foundAuthor) setAuthor(foundAuthor);
    }
  }, [onEdit, data]);

  const handleClose = () => {
    setOpen(false);
    setOnEdit(-1);
    setFilter('');
    setFilterData(null);
  };

  const handleSubmit = async () => {
    try {
      await addOrUpdateAuthor(author, onEdit);
      queryClient.invalidateQueries(
        {
          queryKey: ["authors"],
          refetchType: "active",
        },
        { throwOnError: true },
      );
      alert(`Author ${onEdit === -1 ? 'added' : 'updated'} successfully`);
    } catch (error) {
      console.error(error);
      alert(`Error ${onEdit === -1 ? 'adding' : 'updating'} author: ${error}`);
    }
    setOnEdit(-1);
    setAuthor({ name: '', biography: '', birthday: '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const filteredNames = data?.filter((author) => 
        author.name.toLowerCase().startsWith(filter.toLowerCase())
      );
      setFilterData(filteredNames || null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>Author</Button>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Author</DialogTitle>
          <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input 
                  autoFocus 
                  required
                  value={author.name}
                  onChange={(e) => setAuthor({ ...author, name: e.target.value })}
                />
                <FormLabel>Biography</FormLabel>
                <TextField 
                  required
                  value={author.biography}
                  multiline
                  rows={4}
                  onChange={(e) => setAuthor({ ...author, biography: e.target.value })} 
                />
                <FormLabel>Birthday</FormLabel>
                <Input 
                  required
                  value={author.birthday}
                  type="date"
                  onChange={(e) => setAuthor({ ...author, birthday: e.target.value })}
                />
              </FormControl>
              <Button disabled={!author.name || !author.biography || !author.birthday} type="submit">
                {onEdit === -1 ? 'Add' : 'Update'}
              </Button>
            </Stack>
          </form>
          <FormLabel>Filter by name</FormLabel>
          <Input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <DataGridAuthor data={filterData || data} setOnEdit={setOnEdit} />
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
