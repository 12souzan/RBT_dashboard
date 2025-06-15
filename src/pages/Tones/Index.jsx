import TableComponent from "../../components/TableComponent";
import MainLayout from "../../layouts/MainLayout";
import { musicColumns } from "../../env";
import { Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTone } from "../../context/ToneContext";
import { useBundle } from "../../context/BundleContext";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import BundlePriceManager from "../../components/Bundle/BundlePriceManager";
import BreadcrumbsTitle from "../../components/Breadcrumbs";

const TonesTable = () => {
  const navigate = useNavigate();
  const { tones, deleteTone, showSnackbar, fetchToneDetails } = useTone();
  const { bundles, createBundlePrice, deleteBundlePrice, showSnackbar: BundleSnackBar } = useBundle();
  const [selectionModel, setSelectionModel] = useState([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [showBundleDialog, setShowBundleDialog] = useState(false);
  const breadcrumbItems = [
    { label: 'Tones' },
  ];

  const handleNavigate = () => {
    navigate('/add_tone');
  };

  const handleDeleteTone = async (id) => {
    try {
      await deleteTone(id);
      showSnackbar('Tone deleted successfully');
      setSelectionModel(prev => prev.filter(toneId => toneId !== id));
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectionModel.map(async id => {
        await deleteTone(id);
      }));
      showSnackbar(`${selectionModel.length} tones deleted successfully`);
      setSelectionModel([]);
      setOpenBulkDeleteDialog(false);
    } catch (err) {
      showSnackbar(`Error deleting tones: ${err.message}`, 'error');
    }
  };

  const handleSelectionChange = (newSelection) => {
    const selectedIds = Array.isArray(newSelection)
      ? newSelection
      : (newSelection?.ids ? Array.from(newSelection.ids) : []);
    setSelectionModel(selectedIds);
  };

  return (
    <MainLayout className="h-full">
      <BreadcrumbsTitle items={breadcrumbItems}/>
      <div className="flex flex-col py-[0px] pb-[50px] justify-end gap-4 items-end">
        <div className="flex gap-4 w-full justify-end items-center flex-wrap">
          {selectionModel.length > 0 && (
            <div className="flex gap-4 items-center">
              <Chip
                label={`${selectionModel.length} selected`}
                color="primary"
                variant="outlined"
              />
              <Button
                variant="contained"
                sx={{ background: '#df307e' }}
                onClick={() => setOpenBulkDeleteDialog(true)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
              <Button
                variant="outlined "
                onClick={() => setShowBundleDialog(true)}
                sx={{ border: ' 1px solid #193b8b', background: 'white', color: '#193b8b' }}
                startIcon={<MusicNoteIcon />}
              >
                Add Bundles
              </Button>
            </div>
          )}
          <Button
            variant="contained"
            sx={{ background: '#193b8b' }}
            onClick={handleNavigate}
            startIcon={<MusicNoteIcon />}
          >
            Add Tones
          </Button>
        </div>

        <TableComponent
          columns={musicColumns}
          data={tones}
          editRoute="/tone/edit"
          viewRoute="/tone/view"
          appearActions={['view', 'edit', 'delete']}
          onDelete={handleDeleteTone}
          checkboxSelection={true}
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionChange}
          getRowId={(row) => String(row.id)}
        />

        {openBulkDeleteDialog && (
          <ConfirmationDialog
            open={openBulkDeleteDialog}
            handleClose={() => setOpenBulkDeleteDialog(false)}
            dialogTitle="Confirm Bulk Deletion"
            dialogContent={`Are you sure you want to delete ${selectionModel.length} selected tones?`}
            functionType="Delete"
            confirmDelete={handleDeleteSelected}
            iconDialog={<DeleteIcon />}
          />
        )}

        <Dialog
          open={showBundleDialog}
          onClose={() => setShowBundleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <div className="flex justify-between">
            <DialogTitle>
              Add Bundles to {selectionModel.length} Selected Tones
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setShowBundleDialog(false)}>
                <CloseIcon />
              </Button>
            </DialogActions>
          </div>

          <DialogContent dividers>
            <BundlePriceManager
              selectionModel={selectionModel}
              bundles={bundles}
              createBundlePrice={createBundlePrice}
              deleteBundlePrice={deleteBundlePrice}
              fetchToneDetails={fetchToneDetails}
              onClose={() => setShowBundleDialog(false)}
              showSnackbar={BundleSnackBar}
            />
          </DialogContent>

        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TonesTable;