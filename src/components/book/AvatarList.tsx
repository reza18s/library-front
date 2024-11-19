import React from "react";
import { Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Grid2 } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import Grid from '@mui/material/Grid2';

import { styled } from "@mui/system";

// Sample array of objects
const data = [
  { id: 14, name: "Music 2" },
  { id: 17, name: "Action" },
];

// Styled container
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

interface Props {
    items: { id: number; name: string }[];
    onDelete: (id: number) => void;
  }
interface AvatarListProps {
items: { id: number; name: string }[];
onDelete: (id: number) => void;
}

  function AvatarList({ items, onDelete }: AvatarListProps) {
    return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Avatar with Text and Icon
      </Typography>
      <Demo>
        <List dense>
          {items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Demo>
    </Grid>
  );
};

// Example usage
const App = () => {
  const handleDelete = (id: number) => {
    console.log("Deleted item with ID:", id);
    // Implement delete logic here
  };

  return (
    <Grid container spacing={2}>
      <AvatarList items={data} onDelete={handleDelete} />
    </Grid>
  );
};

export default App;
