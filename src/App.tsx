import { useQuery } from "@tanstack/react-query";
import {Button, Typography, Box, Container } from '@mui/material';
import ModalGenre from "./components/genre/ModalGenre";
import ModalAuthor from "./components/author/ModalAuthor";
import BookContainer from "./components/book/BookContainer";



function App() {

  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>Hello Vite + React!</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <ModalGenre/>
          <ModalAuthor/>

        </Box>
      </Box>
      <Box>
        <BookContainer />
      </Box>

    </>
  );
}



export default App;

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}