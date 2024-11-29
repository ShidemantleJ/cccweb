import {Box, Container, Typography} from '@mui/material';
import {useLocation} from 'react-router-dom';

export default function Footer () {
    const pathname = useLocation().pathname.toLowerCase();
    if (
      (pathname.includes('/team') && !pathname.includes('/teamstatistics')) ||
      pathname.includes('/judge') ||
      pathname.includes('/streamstats')
    )
      return null;

    return (
        <Box
        component="footer"
        sx={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            py: 3,
            width: '100%',
            position: 'static',
            bottom: 0,
        }}
        >
        <Container maxWidth="lg">
            <Typography variant="body2" align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
                <span style={{ color: 'white' }}>|</span>
                <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Site by John Shidemantle, © {new Date().getFullYear()}
            </Typography>
        </Container>
        </Box>
    )
}