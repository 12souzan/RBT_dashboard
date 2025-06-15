import { Snackbar, Alert } from '@mui/material';

const AlertCustom = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={1000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertCustom;
