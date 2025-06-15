import React from 'react';
import {
    Tooltip,
    Badge,
    InputAdornment,
    styled,
    TextField,
} from '@mui/material';
import {
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    useGridApiContext,
} from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledToolbarButton = styled('button')(({ theme }) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    '&:hover': {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
    },
}));

const StyledQuickFilter = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: 260,
    transition: theme.transitions.create(['width', 'opacity']),
}));

export function CustomToolbar() {
    const apiRef = useGridApiContext();

    return (
        <div className='flex flex-wrap gap-[8px] p-[8px] justify-end'>
            <Tooltip title="Columns">
                <GridToolbarColumnsButton />
            </Tooltip>
            <Tooltip title="Filters">
                <GridToolbarFilterButton
                    componentsProps={{
                        button: {
                            sx: {
                                minWidth: 'auto',
                            },
                        },
                    }}
                />
            </Tooltip>
            <StyledQuickFilter>
                <Tooltip title="Search">
                    <StyledToolbarButton>
                        <SearchIcon fontSize="small" />
                    </StyledToolbarButton>
                </Tooltip>
                <StyledTextField
                    size="small"
                    placeholder="Search..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: apiRef.current?.state.filter.quickFilterValues?.length ? (
                            <InputAdornment position="end">
                                <StyledToolbarButton
                                    onClick={() => apiRef.current.setQuickFilterValues([])}
                                >
                                    <CancelIcon fontSize="small" />
                                </StyledToolbarButton>
                            </InputAdornment>
                        ) : null,
                    }}
                    onChange={(e) => apiRef.current.setQuickFilterValues(e.target.value ? [e.target.value] : [])}
                />
            </StyledQuickFilter>
        </div>
    );
}