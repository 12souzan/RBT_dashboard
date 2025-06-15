import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './index.css'
import App from './App.jsx'
import { ToneProvider } from './context/toneContext.jsx';
import { BundleProvider } from './context/BundleContext.jsx';
import { AlbumProvider } from './context/AlbumContext.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#172955',
    },
    secondary: {
      main: '#df307e',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BundleProvider>
        <AlbumProvider>
      <ToneProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
      </ToneProvider>
        </AlbumProvider>
    </BundleProvider>
  </StrictMode>,
)
