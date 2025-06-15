import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAlbum } from '../../context/AlbumContext';
import MainLayout from '../../layouts/MainLayout';
import Loading from '../../components/Loading';
import BreadcrumbsTitle from '../../components/Breadcrumbs';

const View = () => {
  const { id } = useParams();
  const { currentAlbum, isLoading, fetchAlbumDetails, showSnackbar } = useAlbum();
  const breadcrumbItems = [
    { label: 'Albums', path: '/albums' },
    { label: 'Details' },
  ];

  useEffect(() => {
    const loadAlbumData = async () => {
      try {
        await fetchAlbumDetails(id);
      } catch (err) {
        showSnackbar(`Failed to load album: ${err.message}`, 'error');
      }
    };

    loadAlbumData();
  }, [id]);

  if (isLoading || !currentAlbum) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Loading />
      </Box>
    );
  }

  const {
    name,
    featuredArtists,
    genre,
    image,
    createdAt,
    updatedAt,
    albumTones = [],
    bundleList = []
  } = currentAlbum;

  return (
    <MainLayout>
      <BreadcrumbsTitle items={breadcrumbItems} />
      <Box p={4}>
        <Paper elevation={4} sx={{ borderRadius: 3, maxWidth: 900, mx: 'auto', overflow: 'hidden' }}>
          {image ? (
            <Box
              sx={{
                height: 300,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 300,
                backgroundImage: `url(/default.avif)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}


          <CardContent sx={{ p: 4 }}>

          <Typography variant="subtitle1" gutterBottom><strong>Created:</strong> {createdAt}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>Updated:</strong> {updatedAt}</Typography>

          <Divider sx={{ my: 3 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {name}
            </Typography>

            <Box className='flex flex-col gap-3'>
              <Grid className='grid gap-3'>
                <Typography><strong>Featured Artists:</strong> {featuredArtists}</Typography>
                <Typography><strong>Genre:</strong> {genre}</Typography>
                <Typography><strong>Total Tones:</strong> {albumTones.length}</Typography>
              </Grid>
            </Box>

            {albumTones.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Album Tones
                </Typography>

                <Grid container spacing={2}>
                  {albumTones.map((tone) => (
                    <Grid item xs={12} sm={6} md={4} key={tone.id}>
                      <Box
                        sx={{
                          border: '1px solid #ddd',
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: tone.active ? '#b5baca4a' : '#df307e38',
                          gap: '10px',
                          display: 'grid'
                        }}
                      >
                        <Typography fontWeight="bold">{tone.name}</Typography>
                        <Typography><strong>Artist:</strong> {tone.artist}</Typography>
                        <Chip
                          label={tone.active ? 'Active' : 'Inactive'}
                          size="small"
                          color={tone.active ? 'primary' : 'secondary'}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {bundleList.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Available Bundles
                </Typography>

                <Grid container spacing={2}>
                  {bundleList.map((bundle) => (
                    <Grid item xs={12} sm={6} md={4} key={bundle.bundleId}>
                      <Box
                        sx={{
                          border: '1px solid #ddd',
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: '#b5baca4a',
                          gap: '10px',
                          display: 'grid'
                        }}
                      >
                        <Typography fontWeight="bold">{bundle.name}</Typography>
                        <Typography><strong>Price:</strong> {bundle.price}</Typography>
                        <Typography><strong>Validity:</strong> {bundle.validity} days</Typography>
                        <Typography><strong>Grace Period:</strong> {bundle.gracePeriod} days</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

          </CardContent>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default View;