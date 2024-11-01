import { ModalDialog } from "@mui/joy";
import { Button, DialogTitle, FormControl, FormLabel, Input, InputLabel, MenuItem, Modal, Select, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";


interface ModalBookProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  book: any
  setBook: React.Dispatch<React.SetStateAction<any>>
  edit?: boolean
  setEdit: React.Dispatch<React.SetStateAction<any>>

}
export default function ModalBook({ open, setOpen, book, setBook, edit, setEdit }: ModalBookProps) {

  const queryClient = useQueryClient();  // Correct way to access QueryClient
  const { data:genre, error:genreError, isLoading:genreLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/genre");
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });
  const { data:author, error:authorError, isLoading:authorLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/author");
      if (!response.ok) throw new Error("Failed to fetch authors");
      return response.json();
    },
  });
  if (genreLoading || authorLoading) return <div>Loading...</div>;
  if (genreError || authorError) return <div>Error occurred!</div>;
  useEffect(() => {
  
  if (!genreLoading && !authorLoading) {
      setBook({
      title: '',
      publication_year: '',
      copies_available: '',
      total_copies: '',
      author_id: author[0].id,
      genre_id: genre[0].id
    })
  }
}, [genre, author]);
  const handleClose = () => {
    setOpen(false);
  };
  const updateBook = (updatedFields: any) => {
    setBook((prevBook: any) => ({
      ...prevBook,         // Keep existing fields
      ...updatedFields     // Update only the fields specified in updatedFields
    }));
  };
  const genreItems = genre?.map((genre: { id: any | null | undefined; name: string }) => (
    <MenuItem key={genre.id} value={genre.id}>
      {genre.name}  
    </MenuItem>
  ))
  const authorItems = author?.map((author: { id: any | null | undefined; name: string }) => (
    <MenuItem key={author.id} value={author.id}>
      {author.name}  
    </MenuItem>
  ))
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault(); 
    alert(JSON.stringify(book));
    if (edit) {
      try {
        const response = await fetch(`http://localhost:3000/book/${book.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });
        if (!response.ok) throw new Error('Failed to update book');
        alert('Book updated successfully');
        setEdit(false);
      } catch (error) {
        console.error(error);
        alert('Error updating book');
      }
    }else {
      try {
        const response = await fetch('http://localhost:3000/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });
        if (!response.ok) throw new Error('Failed to add book');
        alert('Book added successfully');
      } catch (error) {
        console.error(error);
        alert('Error adding book');
      }
    }
    await queryClient.invalidateQueries(
      {
        queryKey: ['book'],
        refetchType: 'active',
      },
      { throwOnError: true},
    )
    setBook({
      title: '',
      publication_year: '', 
      copies_available: '',
      total_copies: '',
      author_id: Number,
      genre_id: Number
      })

    setOpen(false);
  }

    return (
        <React.Fragment>
        <Modal open={open} onClose={() => handleClose() }>
          <ModalDialog>
            <DialogTitle sx={{ ml: 3 }}>Book</DialogTitle>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSubmit(event);
              }}
            >
              <Stack >
                <FormControl sx={{ mb: 2 }} fullWidth>
                    <FormLabel>Title</FormLabel>
                    <Input sx={{ mb: 2 }}  
                    autoFocus 
                    required
                    value={book.title}
                    onChange={(e) => setBook({...book, title: e.target.value})} // Update state on input change
                    />
              <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                <Select
                  labelId="genre_id"
                  id="genre_id"
                  value={book.genre_id}
                  label="Genre"
                  onChange={(event) => updateBook({ genre_id: Number(event.target.value) })}
                  >
                  {genreItems}
                </Select>
              </FormControl>                    
              <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">authorID</InputLabel>
                <Select
                  labelId="genre_id"
                  id="author_id"
                  value={book.author_id}
                  label="author"
                  onChange={(event) => updateBook({ author_id: Number(event.target.value) })}
                  >
                  {authorItems}
                </Select>
              </FormControl>  

                  <FormLabel>copies_available</FormLabel>
                  <Input 
                    required
                    value={book.copies_available}
                    type="number"
                    onChange={(e) => setBook({...book, copies_available: e.target.value})} 
                  />
                  <FormLabel>total_copies</FormLabel>
                  <Input 
                    required
                    value={book.total_copies}
                    type="number"
                    onChange={(e) => setBook({...book, total_copies: e.target.value})} 
                  />
                  <FormLabel>publication_year</FormLabel>
                  <Input 
                    required
                    value={book.publication_year}
                    type="date"
                    onChange={(e) => setBook({...book, publication_year: e.target.value})} // Update state on input change
                  />
                </FormControl>
                <Button disabled={
                    !book.title || 
                    !book.copies_available || 
                    !book.total_copies || 
                    !book.publication_year || 
                    !book.author_id ||
                    !book.genre_id} type="submit">{edit ? 'Update' : 'Add'}</Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    )
}