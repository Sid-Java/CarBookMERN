import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  const links = [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Privacy', href: '#' }
  ];

  const socialLinks = [
    { icon: <GitHubIcon />, href: 'https://github.com/Sid-Java/REACTICTAK', label: 'GitHub' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 3,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Copyright and Links */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1, sm: 3 }
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} A&S Car Booking
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Social Links */}
          <Box>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                size="small"
                sx={{
                  mx: 0.5,
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
