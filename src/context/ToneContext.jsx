import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../env';

const ToneContext = createContext();

export const ToneProvider = ({ children }) => {
    const [tones, setTones] = useState([]);
    const [currentTone, setCurrentTone] = useState(null);
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

    const transformToneData = (tone) => {
        return {
            id: tone.id.toString(),
            name: tone.name,
            image: `${BASE_URL}tone/${tone.id}/image`,
            toneUrl: `${BASE_URL}gallery-tone/${tone.id}/audio`,
            artist: tone.artist,
            genre: tone.genre,
            language: tone.language,
            duration: tone.duration || 11 ,
            active: tone.active? true : false,
            toneType: tone.toneType,
            standaloneTone: !tone.albumId,
            albumId: tone.albumId || '',
            createdAt: tone.createdAt ? new Date(tone.createdAt).toLocaleDateString() : 'N/A',
            updatedAt: tone.updatedAt ? new Date(tone.updatedAt).toLocaleDateString() : 'N/A',
            bundleList: tone.bundleList ? tone.bundleList.map(b => ({
                bundleId: b.id,
                name: b.name,
                price: b.price || 0,
                validity: b.validity,
                gracePeriod: b.gracePeriod
            })) : [],
        };
    };

    const fetchTones = async (params = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}gallery-tone`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                const transformedData = response.data.data.list.map(transformToneData);
                setTones(transformedData);
                return transformedData; 
            }
            throw new Error(response.data?.message || 'Unexpected API response format');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load tones: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchToneDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}gallery-tone/details`);
            console.log(response)
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                const tonesData = response.data.data.list ||
                    response.data ||
                    (Array.isArray(response.data.data) ? response.data.data : []);

                const tone = tonesData.find(tone => tone.id === id);

                if (!tone) {
                    throw new Error('Tone not found');
                }

                const transformedTone = transformToneData(tone);
                console.log('transformedTone', transformedTone);
                setCurrentTone(transformedTone);
                return transformedTone;
            }
            throw new Error(response.data?.message || 'Failed to fetch tones');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load tone: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const createTone = async (formData) => {
        setIsLoading(true);
        try {
            console.log('FormData content:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post(`${BASE_URL}gallery-tone`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Tone created successfully');
                const tones = await fetchTones();
                const newTone = tones.find(t => t.name === formData.get('name'));
                return newTone || response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to create tone');
        } catch (err) {
            console.error('Creation error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Error creating tone: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateTone = async (id, toneData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            const simpleFields = ['name', 'artist', 'genre', 'language', 'toneType',
                'albumId', 'standaloneTone'];

            simpleFields.forEach(field => {
                if (toneData[field] !== undefined) {
                    formData.append(field, toneData[field]);
                }
            });

            formData.append('active', toneData.active ? "true" : "false");

            // Handle image removal
            if (toneData.currentImage === "" && !toneData.imageFile) {
                formData.append('removeImage', 'true');
            }

            // Handle files
            if (toneData.imageFile instanceof File) {
                formData.append('imageFile', toneData.imageFile);
            }

            if (toneData.toneFile instanceof File) {
                formData.append('toneFile', toneData.toneFile);
            }

            if (toneData.bundleList && toneData.bundleList.length > 0) {
                formData.append('bundleList', JSON.stringify(toneData.bundleList));
            }

            const response = await axios.patch(
                `${BASE_URL}gallery-tone/${id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data?.status === 2100000) {
                showSnackbar('Tone updated successfully');
                await fetchTones();
                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to update tone');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Error updating tone: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTone = async (id) => {
        setIsLoading(true);
        console.log('delete', id)
        try {
            const response = await axios.delete(`${BASE_URL}gallery-tone/${id}`);
            console.log(response.data)
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Tone deleted successfully');
                await fetchTones();
                return true;
            }
            throw new Error(response.data?.message || 'Failed to delete tone');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Error deleting tone: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTones();
    }, []);

    const value = {
        tones,
        currentTone,
        isLoading,
        error,
        fetchTones,
        fetchToneDetails,
        createTone,
        updateTone,
        deleteTone,
        showSnackbar
    };

    return (
        <ToneContext.Provider value={value}>
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
        </ToneContext.Provider>
    );
};

export const useTone = () => {
    const context = useContext(ToneContext);
    if (!context) {
        throw new Error('useTone must be used within a ToneProvider');
    }
    return context;
};