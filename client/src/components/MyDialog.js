import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

function MyDialog({ image, open, setOpen, setImg, name }) {
  return (
    <Dialog
      aria-labelledby="responsive-dialog-title"
      open={open}
      onClose={() => { setOpen(false); setImg(null); }}
      maxWidth="xl"
    >
      <DialogContent> <img src={image} height="600rem" alt={name} /></DialogContent>
    </Dialog>
  );
}

export default MyDialog;
