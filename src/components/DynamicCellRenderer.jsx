import React from 'react';
import {
  Switch,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const DynamicCellRenderer = ({ value, type, options, row, onChange }) => {
    const boolValue = String(value) === 'true' || value === true;

  switch (type) {
    case (type === 'switch' || type === 'boolean') :
    return (
      <Box display="flex" justifyContent="center">
        <Switch
          checked={boolValue}
          onChange={(e) => {
            const newValue = e.target.checked;
            console.log('Value changed to:', newValue);
            onChange?.(newValue);
          }}
          color="primary"
        />
      </Box>
    );
  

    case 'dropdown':
      return (
        <Select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {options?.map((option) => (
            <MenuItem
              key={option.value || option}
              value={option.value || option}
            >
              {option.label || option}
            </MenuItem>
          ))}
        </Select>
      );

    case 'file':
      return value ? (
        <Chip
          avatar={<Avatar>F</Avatar>}
          label={value.name || 'File'}
          variant="outlined"
        />
      ) : (
        <Typography variant="body2" color="textSecondary">No file</Typography>
      );

    case 'array':
      return (
        <div>
          {value?.map((item, index) => (
            <Chip
              key={index}
              label={item.name || `Item ${index + 1}`}
              color='main.primary'
            />
          ))}
        </div>
      );

    case 'boolean':
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {value ? (
            <CheckIcon sx={{color:"#172955" }}/>
          ) : (
            <CloseIcon sx={{color:"#df307e" }} />
          )}
        </Box>
      )

    default:
      return <Typography>{value}</Typography>;
  }
};

export default DynamicCellRenderer;