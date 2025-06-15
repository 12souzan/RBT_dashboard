import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbsTitle = ({ items, homeIcon = true }) => {
  return (
    <Breadcrumbs 
      aria-label="breadcrumb" 
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{
        py:'15px',
        '& .MuiBreadcrumbs-separator': {
          mx: 0.5,
        }
      }}
    >
      {homeIcon && (
        <Link
          underline="hover"
          color="inherit"
          href="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '1.2rem' ,
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: '1.4rem' , color:'#df307e'}} />
          Dashboard
        </Link>
      )}

      {items.map((item, index) => (
        <div key={index}>
          {index === items.length - 1 ? (
            <Typography
              color="primary"
              sx={{ 
                fontSize: '1.2rem',
                fontWeight: 500 
              }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              href={item.path || '#'}
              sx={{
                fontSize: '1.2rem',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsTitle;