import { ModalDialog } from "@mui/joy";
import { Button, DialogTitle, FormControl, FormLabel, Input, InputLabel, MenuItem, Modal, Select, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ModalBook() {

  // const queryClient = useQueryClient();  // Correct way to access QueryClient
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
  // if (genreLoading || authorLoading) return <div>Loading...</div>;
  // if (genreError || authorError) return <div>Error occurred!</div>;
  const [open, setOpen] = React.useState<boolean>(false);
  const [genreID, setGenreID] = React.useState<number>();
  const [authorID, setAuthorID] = React.useState<number>();
  const [book, setBook] = React.useState({
    title: '',
    publication_year: '',
    copies_available: '',
    total_copies: '',
    author_id: '',
    genre_id: ''
  })
useEffect(() => {
  console.log("genreLoading", genreLoading);
  
  if (!genreLoading && !authorLoading) {
    setGenreID(genre[0].id);
    setAuthorID(author[0].id);
  }
}, [genre, author]);
  console.log(genre, author);
  const handleClose = () => {
    setOpen(false);
  };
  // const options = ['Option 1', 'Option 2', 'Option 3'];
  console.log("genreID", genreID);
  console.log("authorID", authorID);
  const genreItems = genre?.map((genre: { id: React.Key | readonly string[] | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
    <MenuItem key={genre.id} value={genre.id}>
      {genre.name}  
    </MenuItem>
  ))
  const authorItems = author?.map((author: { id: React.Key | readonly string[] | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
    <MenuItem key={author.id} value={author.id}>
      {author.name}  
    </MenuItem>
  ))
    return (
        <React.Fragment>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          Add book
        </Button>
        <Modal open={open} onClose={() => handleClose() }>
          <ModalDialog>
            <DialogTitle sx={{ ml: 3 }}>Book</DialogTitle>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                // handleSubmit();
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input 
                    autoFocus 
                    required
                    value={book.title}
                    onChange={(e) => setBook({...book, title: e.target.value})} // Update state on input change
                    />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={genreID}
                  label="Genre"
                  onChange={(event) => setGenreID(Number(event.target.value))}
                  >
                  {genreItems}
                </Select>
              </FormControl>                    
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">authorID</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={authorID}
                  label="author"
                  onChange={(event) => setAuthorID(Number(event.target.value))}
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
                    !book.genre_id} type="submit">Add</Button>
              </Stack>
            </form>
            {/* <FormLabel>Filter by name</FormLabel>
            <Input 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
            />          
            <DataGridAuthor  data={filterData ? filterData : data} setOnedit={setOnedit} /> */}
          </ModalDialog>
        </Modal>
      </React.Fragment>
    )
}