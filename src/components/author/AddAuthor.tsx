import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

export default function ModalAuthor() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="outlined" color="neutral" onClick={handleOpen}>
        Author
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle>Genre</DialogTitle>
          <DialogContent>
            <Button onClick={handleClose}>Add new genre</Button>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
