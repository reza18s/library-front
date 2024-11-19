import React, { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ModalDialog } from '@mui/joy';

import { 
  Modal,
  Button,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField } from "@mui/material";

interface Genre {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
}

interface Book {
  id?: number;
  title: string;
  publication_year: string;
  copies_available: string;
  total_copies: string;
  genres: Genre[];
  authors: Author[];
  author_id: number;
  genre_id: number;
}

interface ModalBookProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // book: Book;
  // setBook: React.Dispatch<React.SetStateAction<Book>>;
  book: any;
  setBook: any;
  isEdit?: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalAddEditBook({ open, setOpen, book, setBook, isEdit, setEdit }: ModalBookProps) {
  const queryClient = useQueryClient();
  console.log('book in modal', book);
  
  const { data: genres = [], error: genreError, isLoading: genreLoading } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/genre");
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });

  const { data: authors = [], error: authorError, isLoading: authorLoading } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/author");
      if (!response.ok) throw new Error("Failed to fetch authors");
      return response.json();
    },
  });

  // Set initial state when opening modal for a new book
  useEffect(() => {
    if (open && !isEdit && genres.length && authors.length) {
      setBook({
        title: '',
        publication_year: '',
        copies_available: '',
        total_copies: '',
        genres: [],
        authors: [],
        author_id: authors[0].id,
        genre_id: genres[0].id,
      });
    }
  }, [open, isEdit, genres, authors, setBook]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEdit(false);
    setBook({
      title: '',
      publication_year: '',
      copies_available: '',
      total_copies: '',
      genres: [],
      authors: [],
      author_id: authors[0]?.id || 0,
      genre_id: genres[0]?.id || 0,
    });
  }, [setOpen, setEdit, setBook, authors, genres]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const url = isEdit ? `http://localhost:3000/book/${book.id}` : "http://localhost:3000/book";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'add'} book`);
      
      alert(`Book ${isEdit ? 'updated' : 'added'} successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["books"],
        refetchType: "active",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      alert(`Error ${isEdit ? 'updating' : 'adding'} book`);
    }
  };

  if (genreLoading || authorLoading) return <div>Loading...</div>;
  if (genreError || authorError) return <div>Error loading genres or authors.</div>;

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Book</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              label="Title"
              variant="filled"
              size="small"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
            <FormControl fullWidth variant="filled" size="small">
              <InputLabel>Genre</InputLabel>
              <Select
                value={book.genre_id}
                onChange={(e) => setBook({ ...book, genre_id: Number(e.target.value) })}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="filled" size="small">
              <InputLabel>Author</InputLabel>
              <Select
                value={book.author_id}
                onChange={(e) => setBook({ ...book, author_id: Number(e.target.value) })}
              >
                {authors.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              label="Copies Available"
              variant="filled"
              size="small"
              value={book.copies_available}
              onChange={(e) => setBook({ ...book, copies_available: e.target.value })}
            />
            <TextField
              required
              label="Total Copies"
              variant="filled"
              size="small"
              value={book.total_copies}
              onChange={(e) => setBook({ ...book, total_copies: e.target.value })}
            />
            <TextField
              required
              label="Publication Year"
              variant="filled"
              size="small"
              value={book.publication_year}
              onChange={(e) => setBook({ ...book, publication_year: e.target.value })}
            />
            <Button
              type="submit"
              disabled={!book.title || !book.copies_available || !book.total_copies || !book.publication_year}
            >
              {isEdit ? "Update" : "Add"} Book
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
