import MainLayout from '../../layouts/MainLayout'
import TableComponent from '../../components/TableComponent'
import { useAlbum } from "../../context/AlbumContext";
import { albumColumns } from "../../env";
import { useState } from "react";
import { useBundle } from '../../context/BundleContext';
import BundlePriceManager from '../../components/Bundle/BundlePriceManager';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function Albums() {
    const { albums, showSnackbar, fetchAlbumDetails, fetchAlbums, deleteAlbum } = useAlbum()
    const { bundles, createBundlePrice, deleteBundlePrice, showSnackbar: BundleSnackBar } = useBundle();
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const [showBundleDialog, setShowBundleDialog] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    
    const handleNavigate = () => {
        navigate('/add_album');
    };
    const handleSelectionChange = (newSelection) => {
        const selectedIds = Array.isArray(newSelection)
            ? newSelection
            : (newSelection?.ids ? Array.from(newSelection.ids) : []);
        setSelectionModel(selectedIds);
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            await deleteAlbum(albumId);
            showSnackbar('Album deleted successfully!');
            await fetchAlbums();
        } catch (err) {
            console.error('Error deleting album:', err);
            showSnackbar(err.message || 'Failed to delete album', 'error');
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(
                selectionModel.map(id => deleteAlbum(id))
            );
            showSnackbar(`${selectionModel.length} albums deleted successfully!`);
            setSelectionModel([]);
            setOpenBulkDeleteDialog(false);
            await fetchAlbums();
        } catch (err) {
            console.error('Error deleting albums:', err);
            showSnackbar(
                `Failed to delete some albums: ${err.message}`,
                'error'
            );
        }
    };
    return (
        <MainLayout>
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
                        Add Albums
                    </Button>
                </div>

                <TableComponent
                    columns={albumColumns}
                    data={albums}
                    editRoute="/album/edit"
                    viewRoute="/album/view"
                    appearActions={['view', 'edit', 'delete']}
                    onDelete={handleDeleteAlbum}
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
                        dialogContent={`Are you sure you want to delete ${selectionModel.length} selected Album?`}
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
                            Add Bundles to {selectionModel.length} Selected Album
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
                            fetchToneDetails={fetchAlbumDetails}
                            onClose={() => setShowBundleDialog(false)}
                            showSnackbar={BundleSnackBar}
                            isAlbumContext={true}
                        />
                    </DialogContent>

                </Dialog>
            </div>
        </MainLayout>
    )
}

export default Albums