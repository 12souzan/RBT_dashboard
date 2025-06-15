import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Button } from '@mui/material';
import TableComponent from '../../components/TableComponent';
import AddIcon from '@mui/icons-material/Add';
import { bundleColumns } from '../../env';
import BundleManagerDialog from '../../components/Bundle/Bundle';
import { useBundle } from '../../context/BundleContext';
import BreadcrumbsTitle from '../../components/Breadcrumbs';

function IndexBundle() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const { bundles, createBundle, updateBundle, deleteBundle } = useBundle();

  const handleOpenDialog = (bundle = null) => {
    setEditingBundle(bundle);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBundle(null);
  };

  const handleSaveBundle = async (bundleData) => {
    try {
      if (editingBundle) {
        await updateBundle(editingBundle.id, bundleData);
      } else {
        await createBundle(bundleData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving bundle:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBundle(id);
    } catch (error) {
      console.error('Error deleting bundle:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Bundles' },
  ];

  return (
    <MainLayout>
      <BreadcrumbsTitle items={breadcrumbItems} />
      <div className="flex flex-col justify-end gap-4 items-end">
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          startIcon={<AddIcon />}
          sx={{ background: '#193b8b' }}
        >
          Add Bundle
        </Button>

        <TableComponent
          columns={bundleColumns}
          data={bundles}
          editRoute="/bundle/edit"
          viewRoute="/bundle/view"
          appearActions={['view', 'edit', 'delete']}
          onEdit={(bundle) => handleOpenDialog(bundle)}
          onDelete={handleDelete}
        />

        <BundleManagerDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveBundle}
          editBundle={editingBundle}
        />
      </div>
    </MainLayout>
  );
}

export default IndexBundle;