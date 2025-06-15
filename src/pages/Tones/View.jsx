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
import { useTone } from '../../context/ToneContext';
import MainLayout from '../../layouts/MainLayout';
import Loading from '../../components/Loading';
import BreadcrumbsTitle from '../../components/Breadcrumbs';


const View = () => {
  const { id } = useParams();
  const { currentTone, isLoading, fetchToneDetails, showSnackbar } = useTone();
    const breadcrumbItems = [
    { label: 'Tones', path: '/tones' },
    { label: 'Details' },
  ];

  useEffect(() => {
    const loadToneData = async () => {
      try {
        await fetchToneDetails(id);
      } catch (err) {
        showSnackbar(`Failed to load tone: ${err.message}`, 'error');
      }
    };

    loadToneData();
  }, [id]);


  if (isLoading || !currentTone) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Loading />
      </Box>
    );
  }

  const {
    name,
    artist,
    genre,
    language,
    toneType,
    active,
    image,
    toneUrl,
    standaloneTone,
    albumId,
    duration,
    createdAt,
    updatedAt,
  } = currentTone;

  return (
    <MainLayout>
      <BreadcrumbsTitle items={breadcrumbItems}/>
      <Box p={4}>
        <Paper elevation={4} sx={{ borderRadius: 3, maxWidth: 900, mx: 'auto', overflow: 'hidden' }}>
          {image ? (
            <Box
              sx={{
                height: 300,
                backgroundImage: `url(${ image })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )
            :
            (
              <Box
                sx={{
                  height: 300,
                  backgroundImage: `url(/default.avif)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )
          }

          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {name}
            </Typography>

            <Box className='flex flex-col gap-3'>
              <Grid className='grid gap-3'>
                <Typography><strong>Artist:</strong> {artist}</Typography>
                <Typography><strong>Genre:</strong> {genre}</Typography>
                <Typography><strong>Language:</strong> {language}</Typography>
                <Typography><strong>Album:</strong> {albumId || '—'}</Typography>
              </Grid>

              <Grid className='grid gap-3'>
                <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>Tone Type:</strong>
                  <Chip label={toneType} variant="outlined" size="small" color="secondary" />
                </Typography>

                <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>Status:</strong>{' '}
                  <Chip label={active ? 'Active' : 'Inactive'} color={active ? 'success' : 'default'} size="small" />
                </Typography>
                <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>Standalone:</strong>{' '}
                  <Chip label={standaloneTone ? 'Yes' : 'No'} color={standaloneTone ? 'primary' : 'primary'} size="small" />
                </Typography>
                <Typography><strong>Duration:</strong> {duration}</Typography>
              </Grid>
            </Box>


            {Array.isArray(currentTone.bundleList) && currentTone.bundleList.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Bundles
                </Typography>

                <Grid container spacing={2}>
                  {currentTone.bundleList.map((bundle) => (
                    <Grid key={bundle.id}>
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
                        <Typography fontWeight="bold">{bundle.name} </Typography>
                        <Typography><strong>Price:</strong> {bundle.price}</Typography>
                        <Typography><strong>Validity:</strong> {bundle.validity} days</Typography>
                        <Typography><strong>Grace Period:</strong> {bundle.gracePeriod} days</Typography>
                        {/* <Chip
                          label={bundle.active ? 'Active' : 'Inactive'}
                          size="small"
                          color={bundle.active ? 'primary' : 'secondary'}
                          sx={{ mt: 1 }}
                        /> */}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}


            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom><strong>Created:</strong> {createdAt}</Typography>
            <Typography variant="subtitle1" gutterBottom><strong>Updated:</strong> {updatedAt}</Typography>

            {toneUrl && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom><strong>Preview:</strong></Typography>
                <audio controls style={{ width: '100%' }}>
                  <source src={toneUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
          </CardContent>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default View;
