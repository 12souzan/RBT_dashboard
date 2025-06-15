import React from 'react';
import { Button, Tooltip, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

function ActionButtons({ onEdit, onDelete, onView, appearActions = [], customActions = [] }) {
  return (
    <Stack direction="row" spacing={1}>
      {appearActions.includes('edit') && (
        <Tooltip title="Edit">
          <IconButton 
            onClick={onEdit} 
            size="small"
            sx={{ 
              color:"",
              '&:hover': { 
                backgroundColor: '#e5e5e5' 
              } 
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      
      {appearActions.includes('delete') && (
        <Tooltip title="Delete">
          <IconButton 
            onClick={onDelete} 
            size="small"
            sx={{ 
              color:'#df307e',
              '&:hover': { 
                backgroundColor: '#df307e2e' 
              } 
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      
      {appearActions.includes('view') && (
        <Tooltip title="View">
          <IconButton 
            onClick={onView} 
            size="small"
            sx={{ 
              color:'#172955',
              '&:hover': { 
                backgroundColor: '#193b8b4f' 
              } 
            }}
          >
            <RemoveRedEyeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      
      {customActions.map((action) => (
        <Tooltip key={action.name} title={action.tooltip || action.name}>
          <IconButton 
            onClick={() => action.onClick?.()} 
            size="small"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.08)' 
              } 
            }}
          >
            {action.icon || <span>{action.name.charAt(0).toUpperCase()}</span>}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default ActionButtons;