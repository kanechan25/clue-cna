import React from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material'
import { useTheme } from '@/provider/themeProvider'
import ClueLogo from '@/assets/images/clue.svg'
import { HeaderProps } from '@/models/types'

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onNewNoteClick }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

  const appBarStyles = {
    width: '100%',
    left: 0,
    right: 0,
    borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
    backdropFilter: 'blur(8px)',
    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  }

  const textFieldStyles = {
    width: { xs: 120, sm: 200, md: 300 },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      },
    },
  }

  const logoStyles = {
    height: { xs: 32, sm: 40 },
    width: 'auto',
    filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
  }

  const themeButtonStyles = {
    borderRadius: 2,
    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    '&:hover': {
      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
    },
  }

  return (
    <AppBar position='sticky' color='inherit' elevation={1} sx={appBarStyles}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box display='flex' alignItems='center' gap={2}>
          <Box component='img' src={ClueLogo} alt='Clue Notes' sx={logoStyles} />
          {!isMobile && (
            <Typography
              variant='h6'
              component='div'
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Collaborative Notes
            </Typography>
          )}
        </Box>

        <Box display='flex' alignItems='center' gap={1}>
          <TextField
            variant='outlined'
            placeholder={isMobile ? 'Search...' : 'Search notes...'}
            value={searchQuery}
            onChange={onSearchChange}
            size='small'
            sx={textFieldStyles}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant='contained'
            startIcon={!isMobile ? <AddIcon /> : undefined}
            onClick={onNewNoteClick}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: { xs: 40, sm: 'auto' },
              px: { xs: 1, sm: 2 },
            }}
          >
            {isMobile ? <AddIcon /> : 'New Note'}
          </Button>

          <IconButton onClick={toggleTheme} sx={themeButtonStyles} aria-label='toggle theme'>
            {isDarkMode ? (
              <LightModeIcon sx={{ color: 'warning.main' }} />
            ) : (
              <DarkModeIcon sx={{ color: 'primary.main' }} />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
