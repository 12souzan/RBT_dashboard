import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../env';

const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
    const [albums, setAlbums] = useState([])
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const transformAlbumData = (album) => {
        return {
            id: album.id.toString(),
            name: album.name,
            image: `${BASE_URL}album/${album.id}/image`,
            featuredArtists: album.featuredArtists,
            genre: album.genre,
            albumTones: album.albumTones || [],
            createdAt: album.createdAt ? new Date(album.createdAt).toLocaleDateString() : 'N/A',
            updatedAt: album.updatedAt ? new Date(album.updatedAt).toLocaleDateString() : 'N/A',
            bundleList: album.bundleList ? album.bundleList.map(b => ({
                bundleId: b.id,
                name: b.name,
                price: b.price || 0,
                validity: b.validity,
                gracePeriod: b.gracePeriod
            })) : [],
        };
    };

    const fetchAlbums = async (params = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}album`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                const transformedData = response.data.data.list.map(transformAlbumData);
                console.log('fetched album data', transformedData)
                setAlbums(transformedData);
                return transformedData;
            }
            throw new Error(response.data?.message || 'Unexpected API response format');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load albums: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    const fetchAlbumDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const detailsResponse = await axios.get(`${BASE_URL}album/${id}/details`);
            const bundlesResponse = await axios.get(`${BASE_URL}album/details`);

            if (detailsResponse.data?.status === 2100000 &&
                bundlesResponse.data?.status === 2100000) {

                const albumsData = bundlesResponse.data.data.list ||
                    bundlesResponse.data.data ||
                    (Array.isArray(bundlesResponse.data.data) ? bundlesResponse.data.data : []);

                const albumWithBundles = albumsData.find(a => a.id === id);

                const combinedData = {
                    ...detailsResponse.data.data,
                    bundleList: albumWithBundles?.bundleList || []
                };

                const transformedAlbum = transformAlbumData(combinedData);
                setCurrentAlbum(transformedAlbum);
                return transformedAlbum;
            }
            throw new Error('Failed to get complete album data');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load album: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    const createAlbum = async (albumData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BASE_URL}album`, albumData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const responseData = response.data;
            if (responseData?.status === 2100000 && responseData?.data?.id) {
                const album = responseData.data;
                showSnackbar('Album created successfully!');
                await fetchAlbums();
                return album;
            }
            if (responseData?.id) {
                showSnackbar('Album created successfully!');
                await fetchAlbums();
                return responseData;
            }

            if (response.status === 200) {
                const albums = await fetchAlbums();
                const newAlbum = albums.find(a => a.name === albumData.get('name'));
                if (newAlbum) {
                    showSnackbar('Album created successfully!');
                    return newAlbum;
                }
            }
            throw new Error(responseData?.message || 'Unexpected API response format');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Detailed album creation error:', {
                error: err,
                response: err.response
            });
            showSnackbar(`Failed to create album: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAlbum = async (albumId, updateData) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Updating album:', albumId, 'with data:', updateData);
            const response = await axios.patch(`${BASE_URL}album/${albumId}`, updateData);

            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                console.log('Album updated successfully:', response.data);
                showSnackbar('Album updated successfully!');
                await fetchAlbums();
                if (currentAlbum?.id === albumId) {
                    await fetchAlbumDetails(albumId);
                }
                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to update album');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Error updating album:', errorMessage);
            setError(errorMessage);
            showSnackbar(`Failed to update album: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAlbum = async (albumId) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Deleting album:', albumId);
            const response = await axios.delete(`${BASE_URL}album/${albumId}`);

            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                console.log('Album deleted successfully:', response.data);
                showSnackbar('Album deleted successfully!');
                await fetchAlbums();
                return response.data;
            }
            throw new Error(response.data?.message || 'Failed to delete album');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Error deleting album:', errorMessage);
            setError(errorMessage);
            showSnackbar(`Failed to delete album: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const addTonesToAlbum = async (albumId, toneIds) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Adding tones to album ${albumId}:`, toneIds);

            const response = await axios.post(
                `${BASE_URL}album/${albumId}/tones`,
                { toneIds },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                console.log('Tones added successfully:', response.data);
                showSnackbar('Tones added to album successfully!');
                await fetchAlbumDetails(albumId);
                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to add tones to album');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Error adding tones:', {
                error: err,
                response: err.response?.data
            });
            setError(errorMessage);
            showSnackbar(`Failed to add tones: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removeToneFromAlbum = async (albumId, toneId) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Removing tone:', toneId, 'from album:', albumId);
            const response = await axios.delete(`${BASE_URL}album/${albumId}/tones/${toneId}`);

            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                console.log('Tone removed successfully:', response.data);
                showSnackbar('Tone removed from album successfully!');
                await fetchAlbumDetails(albumId);
                return response.data;
            }
            throw new Error(response.data?.message || 'Failed to remove tone from album');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Error removing tone:', errorMessage);
            setError(errorMessage);
            showSnackbar(`Failed to remove tone: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const value = {
        albums,
        fetchAlbums,
        fetchAlbumDetails,
        createAlbum,
        updateAlbum,
        deleteAlbum,
        addTonesToAlbum,
        removeToneFromAlbum,
        currentAlbum,
        isLoading,
        showSnackbar,
        error
    };

    return (
        <AlbumContext.Provider value={value}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AlbumContext.Provider>
    );
};

export const useAlbum = () => {
    const context = useContext(AlbumContext);
    if (!context) {
        throw new Error('useAlbum must be used within a AlbumProvider');
    }
    return context;
};