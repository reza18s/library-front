import { useQuery } from "@tanstack/react-query";
import {Button, Typography, Box, Container } from '@mui/material';
import ModalGenre from "./components/genre/ModalGenre";

const fetchUsers = async () => {
  const response = await fetch('http://localhost:3000/genre');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      await wait(1000); // Simulate delay
      return fetchUsers(); // Fetch data after delay
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <>
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>Hello Vite + React!</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ModalGenre/>

        <Button variant="contained" color="primary">Author</Button>
      </Box>
    </Container>
      <h1>Hello Vite + React</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default App;
