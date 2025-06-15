import React, { useContext, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchStyle } from '../utils/Style';

function Search({ value, onChange, placeholder }) {
    return (
        <TextField
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Search..."}
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            sx={searchStyle}
        />
    );
}

export default Search;