import React from 'react';
import { Box, Typography } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AlbumIcon from '@mui/icons-material/Album';

function DashboardComponent({ BundlesCount, TonesCount, AlbumsCount }) {
  const stats = [
    { icon: <LibraryMusicIcon fontSize="large" color="primary" />, label: "Bundles", count: BundlesCount },
    { icon: <MusicNoteIcon fontSize="large" color="secondary" />, label: "Tones", count: TonesCount },
    { icon: <AlbumIcon fontSize="large" color="warning" />, label: "Albums", count: AlbumsCount },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
      {stats.map((stat, index) => (
        <Box 
          key={index}
          className="flex flex-col items-center justify-center gap-4 bg-white p-5 shadow-lg rounded-2xl "
          sx={{ minWidth: 200, minHeight: 120 }}
        >
          {stat.icon}
          <Typography variant="h6" className="mt-2 font-semibold">{stat.count}</Typography>
          <Typography variant="body" className="text-gray-600">{stat.label}</Typography>
        </Box>
      ))}
    </div>
  );
}

export default DashboardComponent;
