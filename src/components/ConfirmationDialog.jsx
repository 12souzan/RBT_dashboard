import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function ConfirmationDialog({ open, handleClose, dialogTitle, dialogContent, functionType, confirmDelete, iconDialog }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>{dialogContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button 
                    startIcon={iconDialog} 
                    onClick={confirmDelete} 
                    variant="contained" 
                    color="error"
                >
                    {functionType}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
