import { styled, alpha } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

export const searchStyle = {
    '.MuiOutlinedInput-root': {
        backgroundColor: '#ffffff',
        border: ' 1px solid #aebbc4',
        '& fieldset': {
            borderColor: 'transparent',
            outline: 'none',
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    },
    '.MuiInputLabel-root': {
        color: 'gray',
    },
    '.MuiInputBase-input': {
        color: '#002847',
    },
    '.MuiInputAdornment-root': {
        color: '#002847',
    },
}

export const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                0.2 + theme.palette.action.selectedOpacity,
            ),
            '&:hover': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    0.2 +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.2 + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
    [`& .${gridClasses.row}.odd`]: {
        backgroundColor: 'white',
        '&:hover': {
            backgroundColor: 'white',
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor:'white',
            '&:hover': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    0.2 +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.2 + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
    [`& .${gridClasses.cell}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    [`& .${gridClasses.columnHeader}`]: {
        backgroundColor: '#eeeeee',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        // '&:hover': {
        //   backgroundColor: alpha(theme.palette.primary.main, 0.8),
        // },
        '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
        },
    },
    [`& .${gridClasses.columnHeaderTitle}`]: {
        fontWeight: 700,
    },
}));

export const paginationStyle = {
    '.Mui-selected': {
        backgroundColor: 'rgb(212 212 212)',
        color: 'black',
    }
}


export const buttonStyle = {
    background: 'black',
    color: 'white',
    paddingX: 2,
    paddingY: 1,
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 7px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: '#1f1f1f',
        transform: 'scale(1.03)',
        boxShadow: '0 6px 8px rgba(0,0,0,0.6)',
    },
}