import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DataGridC from './DataGridC';

export default function ModalGenre() {
  const [open, setOpen] = React.useState<boolean>(false);

    // const { data, error, isLoading } = useQuery({
  //   queryKey: ["genres"],
  //   queryFn: async () => {
  //     const response = await fetch("http://localhost:3000/genre");
  //     if (!response.ok) throw new Error("Failed to fetch genres");
  //     return response.json();
  //   },
  // });
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
          {/* <Button>Add 1111 genre</Button> */}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}