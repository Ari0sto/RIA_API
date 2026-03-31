import { 
  Card, CardMedia, CardContent, Typography, Grid, Stack, Divider, Box, IconButton 
} from '@mui/material';
import BalanceIcon from '@mui/icons-material/Balance';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import type { CarData } from '../types';

interface CarCardProps {
  car: CarData;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
}

export default function CarCard({ car, isFavorite, isCompared, onToggleFavorite, onToggleCompare }: CarCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 107, 0, 0.2)' } }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="220" image={car.photoUrl} alt={car.markName} sx={{ objectFit: 'cover' }} />
        
        <IconButton onClick={() => onToggleCompare(car.id)} sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'primary.main' } }}>
          <BalanceIcon fontSize="small" sx={{ color: isCompared ? 'primary.main' : 'white' }}/>
        </IconButton>
        
        <IconButton onClick={() => onToggleFavorite(car.id)} sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'primary.main' } }}>
          {isFavorite ? <FavoriteIcon fontSize="small" sx={{ color: 'primary.main' }} /> : <FavoriteBorderIcon fontSize="small" sx={{ color: 'white' }} />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase' }}>
          {car.year} {car.markName} {car.modelName}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}><Stack direction="row" spacing={1} alignItems="center"><SpeedIcon fontSize="small" color="disabled" /><Typography variant="body2" color="text.secondary">{car.mileage} тис. км</Typography></Stack></Grid>
          <Grid size={{ xs: 6 }}><Stack direction="row" spacing={1} alignItems="center"><LocalGasStationIcon fontSize="small" color="disabled" /><Typography variant="body2" color="text.secondary" noWrap title={car.fuelAndVolume}>{car.fuelAndVolume}</Typography></Stack></Grid>
          <Grid size={{ xs: 6 }}><Stack direction="row" spacing={1} alignItems="center"><SettingsIcon fontSize="small" color="disabled" /><Typography variant="body2" color="text.secondary">{car.transmission}</Typography></Stack></Grid>
          <Grid size={{ xs: 6 }}><Stack direction="row" spacing={1} alignItems="center"><LocationOnIcon fontSize="small" color="disabled" /><Typography variant="body2" color="text.secondary">{car.city}</Typography></Stack></Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="caption" color="text.secondary">Поточна ціна:</Typography>
            <Typography variant="h5" color="primary.main" fontWeight="bold">${car.priceUSD.toLocaleString()}</Typography>
          </Box>
          {car.vinVerified && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', px: 1, py: 0.5, borderRadius: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="caption" color="success.main" fontWeight="bold">VIN перевірено</Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}