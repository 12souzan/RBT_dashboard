import React, { useEffect, useState } from 'react';
import {
  Box,
  useTheme,
} from '@mui/material';
import ConfirmationDialog from './ConfirmationDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ActionButtons from './ActionButtons';
import DynamicCellRenderer from './DynamicCellRenderer';
import { StripedDataGrid } from '../utils/Style';
import { CustomToolbar } from './CustomToolbar';


export default function TableComponent({
  columns,
  data,
  editRoute,
  viewRoute,
  appearActions = ['view', 'edit', 'delete'],
  loading,
  setLoading,
  onDelete,
  onEdit,
  onView,
  onStatusChange,
  additionalActions,
  customComponents = {},
  selectionModel = [],
  onSelectionModelChange,
  checkboxSelection = false,
  getRowId = (row) => row.id,
}) {

  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTableData(data || []);
    setLoading?.(false);
  }, [data, setLoading]);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId) {
      onDelete ? onDelete(selectedId) : handleDeleteLocal(selectedId);
    }
    handleClose();
  };

  const handleDeleteLocal = (id) => {
    setTableData(prev => prev.filter(row => row.id !== id));
  };

  const handleAction = (action, row) => {
    switch (action) {
      case 'edit':
        onEdit ? onEdit(row) : navigate(`${editRoute}/${row.id}`);
        break;
      case 'view':
        onView ? onView(row) : navigate(`${viewRoute}/${row.id}`);
        break;
      case 'delete':
        handleOpen(row.id);
        break;
      default:
        if (additionalActions?.[action]) {
          additionalActions[action](row);
        }
        break;
    }
  };
  const modifiedColumns = columns.map((col) => {
    const field = col.field || col.name;

    if (col.type) {
      return {
        field,
        headerName: col.label,
        flex: col.flex || 1,
        minWidth: col.minWidth || 100,
        renderCell: (params) => (
          <DynamicCellRenderer
            value={params.row[field]}
            type={col.type}
            options={col.options}
            row={params.row}
            onChange={(newValue) => {
              if (onStatusChange) {
                onStatusChange(params.row.id, field, newValue);
              }
            }}
          />
        ),
        width: col.width || (col.type === 'dropdown' ? 180 : undefined),
        headerAlign: 'center',
        align: 'center',
      };
    }

    if (field === 'actions') {
      return {
        field: 'actions',
        headerName: 'Actions',
        width: appearActions?.length > 0 ? 150 : 0,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <ActionButtons
            appearActions={appearActions}
            onEdit={() => handleAction('edit', params.row)}
            onDelete={() => handleAction('delete', params.row)}
            onView={() => handleAction('view', params.row)}
            customActions={additionalActions ? Object.keys(additionalActions).map(action => ({
              name: action,
              icon: customComponents[action]?.icon,
              tooltip: customComponents[action]?.tooltip
            })) : []}
          />
        ),
      };
    }

    return {
      field,
      headerName: col.label,
      flex: col.flex || 1,
      minWidth: col.minWidth || 100,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row[field]
    };
  });
  return (
    <Box sx={{ width: '100%' }}>
      <StripedDataGrid
        rows={data}
        columns={modifiedColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[6]}
        checkboxSelection={checkboxSelection}
        selectionModel={selectionModel}
        onSelectionModelChange={onSelectionModelChange}
        onRowSelectionModelChange={(newSelection) => {
          // console.log('New selection:', newSelection);
          onSelectionModelChange(newSelection);
        }}
        getRowId={getRowId || ((row) => row.id)}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
      <ConfirmationDialog
        open={open}
        handleClose={handleClose}
        dialogTitle="Confirm Deletion"
        dialogContent={`Are you sure you want to delete this item with ID: ${selectedId}?`}
        functionType="Delete"
        confirmDelete={handleDelete}
        iconDialog={<DeleteIcon />}
      />
    </Box>
  );
}