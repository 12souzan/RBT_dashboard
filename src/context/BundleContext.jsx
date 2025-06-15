import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../env';

const BundleContext = createContext();

export const BundleProvider = ({ children }) => {
    const [bundles, setBundles] = useState([]);
    const [currentBundle, setCurrentBundle] = useState(null);
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

    // Fetch all bundles
    const fetchBundles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}bundle`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                setIsLoading(false);
                setBundles(response.data.data.list || []);
            } else {
                throw new Error(response.data?.message || 'Unexpected API response format');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load bundles: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch single bundle details
    const fetchBundleDetails = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}bundle/${id}`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                setIsLoading(false);
                setCurrentBundle(response.data.data);
                return response.data.data;

            }
            throw new Error(response.data?.message || 'Bundle not found');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Failed to load bundle: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Create new bundle
    const createBundle = async (bundleData) => {
        setIsLoading(true);
        console.log('bundleData', bundleData)
        try {
            const response = await axios.post(`${BASE_URL}bundle`, bundleData);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Bundle created successfully');
                await fetchBundles();

                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to create bundle');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Error creating bundle: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update existing bundle
    const updateBundle = async (id, bundleData) => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}bundle/${id}`, bundleData);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Bundle updated successfully');
                await fetchBundles();
                if (currentBundle?.id === id) {
                    await fetchBundleDetails(id);
                }
                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to update bundle');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Error updating bundle: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete bundle
    const deleteBundle = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}bundle/${id}`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Bundle deleted successfully');
                await fetchBundles();
                if (currentBundle?.id === id) {
                    setCurrentBundle(null);
                }
                return true;
            }
            throw new Error(response.data?.message || 'Failed to delete bundle');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            showSnackbar(`Error deleting bundle: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
    const loadBundles = async () => {
        try {
        await fetchBundles();
        } catch (error) {
        console.error('Failed to load bundles:', error);
        }
    };
    
    loadBundles();
    }, []);


    // Fetch prices for a bundle
    const fetchBundlePrices = async (bundleId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}bundle/price?bundleId=${bundleId}`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                return response.data.data.list || [];
            }
            throw new Error(response.data?.message || 'Failed to fetch prices');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Failed to load prices: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Create new price for a bundle
    const createBundlePrice = async (priceData) => {
    setIsLoading(true);
    try {
        console.log('Creating bundle price with data:', priceData);
        
        if (!priceData.bundleId || !priceData.price) {
        throw new Error('Missing required fields (bundleId and price are required)');
        }

        if (!priceData.albumId && !priceData.toneId) {
        throw new Error('Either albumId or toneId must be provided');
        }
        if (priceData.albumId && priceData.toneId) {
        throw new Error('Cannot specify both albumId and toneId');
        }

        const payload = {
        bundleId: priceData.bundleId,
        price: priceData.price,
        ...(priceData.albumId && { albumId: priceData.albumId }),
        ...(priceData.toneId && { toneId: priceData.toneId })
        };

        const response = await axios.post(`${BASE_URL}bundle/price`, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
        });

        if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
        showSnackbar('Price added successfully');
        return response.data.data;
        }
        throw new Error(response.data?.message || 'Failed to add price');
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        console.error('Detailed price creation error:', {
        error: err,
        response: err.response?.data
        });
        showSnackbar(`Error adding price: ${errorMessage}`, 'error');
        throw err;
    } finally {
        setIsLoading(false);
    }
    };

    // Update bundle price
    const updateBundlePrice = async (priceId, priceData) => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}bundle/price/${priceId}`, priceData);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Price updated successfully');
                return response.data.data;
            }
            throw new Error(response.data?.message || 'Failed to update price');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Error updating price: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete bundle price
    const deleteBundlePrice = async (priceId) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}bundle/price/${priceId}`);
            if (response.data?.status === 2100000 && response.data?.message === 'SUCCESS') {
                showSnackbar('Price deleted successfully');
                return true;
            }
            throw new Error(response.data?.message || 'Failed to delete price');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            showSnackbar(`Error deleting price: ${errorMessage}`, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const value = React.useMemo(() => ({
    bundles,
    currentBundle,
    isLoading,
    setIsLoading,
    error,
    fetchBundles,
    fetchBundleDetails,
    createBundle,
    updateBundle,
    deleteBundle,
    createBundlePrice,
    updateBundlePrice,
    deleteBundlePrice,
    fetchBundlePrices,
    showSnackbar
    }), [bundles, currentBundle, isLoading, error]);

    return (
        <BundleContext.Provider value={value}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
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
        </BundleContext.Provider>
    );
};

export const useBundle = () => {
    const context = useContext(BundleContext);
    if (!context) {
        throw new Error('useBundle must be used within a BundleProvider');
    }
    return context;
};