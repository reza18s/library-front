import { ModalDialog } from "@mui/joy";
import { Button, DialogTitle, FormControl, FormLabel, Input, Modal, Stack, TextField } from "@mui/material";
import React from "react";

export default function ModalBook() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [book, setBook] = React.useState({
    title: '',
    publication_year: '',
    copies_available: '',
    total_copies: '',
    author_id: '',
    genre_id: ''
  })


  const handleClose = () => {
    setOpen(false);
  };
  const options = ['Option 1', 'Option 2', 'Option 3'];


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
                    <FormLabel>Genre</FormLabel>
                    <TextField
                        label="Choose an option"
                        variant="outlined"
                        inputProps={{ list: 'datalistOptions' }}
                    />
                    <datalist id="datalistOptions">
                        {options.map((option, index) => (
                        <option key={index} value={option} />
                        ))}
                    </datalist>

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