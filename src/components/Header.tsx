import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#000000', borderBottom: '2px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ 
        maxWidth: '1400px', width: '100%', px: { xs: 2, md: 4 }, py: 2, 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, 
        alignItems: 'center', 
        gap: 2 
      }}>
        
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Box component="img" src="/logo_l.png" alt="CARS HUB Logo" sx={{ height: { xs: '60px', md: '100px' }, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <TextField 
            variant="outlined" 
            placeholder="Пошук..." 
            value={searchQuery} 
            onChange={onSearchChange} 
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary"/></InputAdornment> }} 
            size="small"
            sx={{ 
              width: { xs: '100%', md: '450px' }, 
              backgroundColor: '#1E1E1E', 
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                '&:hover fieldset': { borderColor: 'primary.main' },
              }
            }}
          />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}></Box>
      </Box>
    </Box>
  );
}