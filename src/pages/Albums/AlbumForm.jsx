import React, { useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import { ALBUM_INITIAL_DATA, getAlbumFields } from '../../env'
import { useBundle } from '../../context/BundleContext';
import { useNavigate } from 'react-router-dom';
import { useAlbum } from '../../context/AlbumContext';
import { Button, Typography } from '@mui/material';
import FormInput from '../../components/FormInput';
import BundlePriceManager from '../../components/Bundle/BundlePriceManager';
import { useTone } from '../../context/ToneContext';
import { transformTonesToOptions } from '../../utils/transformTonesToOptions';
import BreadcrumbsTitle from '../../components/Breadcrumbs';

function AlbumForm() {
    const { createAlbum, addTonesToAlbum, showSnackbar } = useAlbum();
    const { bundles, createBundlePrice, showSnackbar: BundleSnackBar } = useBundle();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { tones } = useTone();
    const toneOptions = transformTonesToOptions(tones);
    const albumFields = getAlbumFields(toneOptions);
    const breadcrumbItems = [
        { label: 'Albums', path: '/albums' },
        { label: 'Create New Album' },
    ];

    const [formData, setFormData] = useState({
        ...ALBUM_INITIAL_DATA,
        currentImage: "",
        imagePreview: "",
        bundleList: [],
        albumTones: [],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.name || !formData.featuredArtists || !formData.genre) {
                throw new Error('Please fill all required fields');
            }

            // Create FormData
            const albumFormData = new FormData();
            albumFormData.append('name', formData.name);
            albumFormData.append('featuredArtists', formData.featuredArtists);
            albumFormData.append('genre', formData.genre);

            if (formData.imageFile) {
                albumFormData.append('imageFile', formData.imageFile);
            }

            // Create album
            const albumResponse = await createAlbum(albumFormData);
            console.log('Album creation response:', albumResponse);
            const albumId = albumResponse.id || albumResponse.data?.id;
            if (!albumId) {
                throw new Error('Album created but could not determine ID. Please check backend response.');
            }
            // Step 2: Add tones 
            if (formData.albumTones?.length > 0) {
                console.log('Adding tones to album:', formData.albumTones);
                await addTonesToAlbum(albumId, formData.albumTones);
            }
            // Add bundle prices if any
            if (formData.bundleList?.length > 0) {
                await Promise.all(
                    formData.bundleList.map(bundle =>
                        createBundlePrice({
                            albumId,
                            bundleId: bundle.bundleId,
                            price: bundle.price
                        })
                    )
                );
            }

            showSnackbar("Album and all associated data created successfully!");
            navigate('/albums');
        } catch (err) {
            console.error("Full error details:", err);
            showSnackbar(
                err.response?.data?.message ||
                err.message ||
                "Failed to complete album creation",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <BreadcrumbsTitle items={breadcrumbItems} />

            <form onSubmit={handleSubmit} className="bg-white mt-3 p-5 shadow-custom">
                <Typography sx={{ fontWeight: '700', textAlign: 'center', fontSize: '35px' }}>
                    Create Album
                </Typography>

                <FormInput
                    fields={albumFields}
                    data={formData}
                    setData={setFormData}
                    AudioUpload={false}
                />

                <BundlePriceManager
                    bundles={bundles}
                    formData={formData}
                    setFormData={setFormData}
                    showSnackbar={BundleSnackBar}
                    isNewTone={true}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Album'}
                </Button>
            </form>
        </MainLayout>
    )
}

export default AlbumForm