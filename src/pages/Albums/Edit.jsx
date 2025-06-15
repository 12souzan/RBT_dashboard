import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import FormInput from "../../components/FormInput";
import MainLayout from '../../layouts/MainLayout';
import { useParams } from "react-router-dom";
import { useAlbum } from "../../context/AlbumContext";
import { useBundle } from "../../context/BundleContext";
import BundlePriceManager from "../../components/Bundle/BundlePriceManager";
import { getAlbumFields } from "../../env";
import { transformTonesToOptions } from "../../utils/transformTonesToOptions";
import { useTone } from "../../context/ToneContext";
import BreadcrumbsTitle from "../../components/Breadcrumbs";

const Edit = () => {
    const { id } = useParams();
    const {
        currentAlbum,
        isLoading,
        fetchAlbumDetails,
        removeToneFromAlbum,
        updateAlbum,
        showSnackbar
    } = useAlbum();

    const { bundles } = useBundle();
    const { tones } = useTone();
    const toneOptions = transformTonesToOptions(tones);
    const albumFields = getAlbumFields(toneOptions);

    const breadcrumbItems = [
        { label: 'Albums', path: '/albums' },
        { label: 'Edit Album' },
    ];

    const [formData, setFormData] = useState({
        name: "",
        featuredArtists: "",
        genre: "",
        imageFile: null,
        imageFileName: "",
        bundleList: [],
    });

    const [errors, setErrors] = useState({});
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!id) {
            showSnackbar('No album ID provided', 'error');
            return;
        }

        const loadAlbumData = async () => {
            try {
                await fetchAlbumDetails(id);
                setHasLoaded(true);
            } catch (err) {
                console.error("Failed to load album data:", err);
                showSnackbar(`Failed to load album: ${err.message}`, 'error');
            }
        };

        loadAlbumData();
    }, [id]);

    useEffect(() => {
        if (hasLoaded && currentAlbum) {
            setFormData({
                name: currentAlbum.name || "",
                featuredArtists: currentAlbum.featuredArtists || "",
                genre: currentAlbum.genre || "",
                imageFile: currentAlbum.image,
                imageFileName: currentAlbum.image ? "Current image file" : "",
                albumTones: currentAlbum.albumTones?.map(t => t.id) || [],
                bundleList: currentAlbum.bundleList ? currentAlbum.bundleList.map(b => ({
                    bundleId: b.id || b.bundleId,
                    name: b.name,
                    price: b.price || 0,
                    validity: b.validity || 30,
                    gracePeriod: b.gracePeriod || 7
                })) : []
            });
        }
    }, [hasLoaded, currentAlbum]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAlbum(id, formData);
            showSnackbar('Album updated successfully!');
        } catch (err) {
            console.error("Error updating album:", err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            showSnackbar(`Error updating album: ${err.message}`, 'error');
        }
    };

    const handleFileChange = (field) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [field]: file,
                [`${field}Name`]: file.name
            }));
        }
    };

    if (isLoading && !hasLoaded) {
        return (
            <MainLayout>
                <Typography>Loading album data...</Typography>
            </MainLayout>
        );
    }

    if (!currentAlbum && hasLoaded) {
        return (
            <MainLayout>
                <Typography>Album not found</Typography>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <BreadcrumbsTitle items={breadcrumbItems} />
            <form onSubmit={handleSubmit} className="bg-white mt-3 p-5 shadow-custom">
                <Typography sx={{ fontWeight: '700', textAlign: 'center', fontSize: '35px' }}>
                    Edit Album
                </Typography>

                <FormInput
                    fields={albumFields}
                    data={formData}
                    setData={setFormData}
                    AudioUpload={false}
                    removeToneFromAlbum={removeToneFromAlbum}
                    albumId={formData.id}
                />

                <BundlePriceManager
                    bundles={bundles}
                    showSnackbar={showSnackbar}
                    formData={formData}
                    setFormData={setFormData}
                    isNewTone={true}
                    isAlbumContext={true}
                />

                <div className="w-full flex mt-2">
                    <Button
                        type="submit"
                        variant="contained"
                        className="w-full"
                        disabled={isLoading}
                    >
                        Update Album
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
};

export default Edit;