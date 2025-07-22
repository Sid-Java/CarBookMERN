import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f48fb1',
      contrastText: '#fff',
    },
    background: {
      default: '#000',
      paper: '#111',
    },
    text: {
      primary: '#fff',
      secondary: '#aaa',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#fff',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#fff',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#fff',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#fff',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#fff',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#fff',
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      color: '#fff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#fff',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      color: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#222',
            color: '#fff',
          },
          '& .MuiInputLabel-root': {
            color: '#aaa',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: '#181818',
          color: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#111',
          color: '#fff',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 12px 24px rgba(0,0,0,0.05)',
  ],
});

export default theme; 