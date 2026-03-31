import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, 
  Typography, Grid, Card, CardMedia, CardContent, Box, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { CarData } from '../types';

interface ModalsProps {
  openFavModal: boolean;
  setOpenFavModal: (open: boolean) => void;
  openCompModal: boolean;
  setOpenCompModal: (open: boolean) => void;
  favCarsData: CarData[];
  compCarsData: CarData[];
  toggleFavorite: (id: number) => void;
  toggleCompare: (id: number) => void;
}

export default function Modals({ 
  openFavModal, setOpenFavModal, openCompModal, setOpenCompModal, 
  favCarsData, compCarsData, toggleFavorite, toggleCompare 
}: ModalsProps) {
  return (
    <>
      {/* МОДАЛЬНОЕ ОКНО: ИЗБРАННОЕ */}
      <Dialog open={openFavModal} onClose={() => setOpenFavModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Обрані лоти</Typography>
          <IconButton onClick={() => setOpenFavModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {favCarsData.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={5}>У вас ще немає збережених авто.</Typography>
          ) : (
            <Grid container spacing={2}>
              {favCarsData.map(car => (
                <Grid size={{ xs: 12, sm: 6 }} key={car.id}>
                  <Card sx={{ display: 'flex', position: 'relative' }}>
                    <CardMedia component="img" sx={{ width: 140 }} image={car.photoUrl} alt={car.markName} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{car.markName} {car.modelName}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="bold">${car.priceUSD.toLocaleString()}</Typography>
                        <Typography variant="caption" color="text.secondary">{car.year} • {car.mileage} тис. км</Typography>
                      </CardContent>
                    </Box>
                    <IconButton onClick={() => toggleFavorite(car.id)} sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenFavModal(false)}>Закрити</Button></DialogActions>
      </Dialog>

      {/* МОДАЛЬНОЕ ОКНО: СРАВНЕНИЕ */}
      <Dialog open={openCompModal} onClose={() => setOpenCompModal(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Порівняння авто</Typography>
          <IconButton onClick={() => setOpenCompModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {compCarsData.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={5}>Додайте авто для порівняння.</Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Характеристика</TableCell>
                    {compCarsData.map(car => (
                      <TableCell key={car.id} align="center" sx={{ minWidth: '200px' }}>
                        <img src={car.photoUrl} alt="car" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                        <Typography variant="subtitle2" fontWeight="bold" mt={1}>{car.markName} {car.modelName} ({car.year})</Typography>
                        <IconButton onClick={() => toggleCompare(car.id)} size="small" color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell component="th" scope="row">Ціна</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center"><Typography color="primary.main" fontWeight="bold">${car.priceUSD.toLocaleString()}</Typography></TableCell>)}</TableRow>
                  <TableRow><TableCell component="th" scope="row">Пробіг</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center">{car.mileage} тис. км</TableCell>)}</TableRow>
                  <TableRow><TableCell component="th" scope="row">Коробка</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center">{car.transmission}</TableCell>)}</TableRow>
                  <TableRow><TableCell component="th" scope="row">Паливо</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center">{car.fuelAndVolume}</TableCell>)}</TableRow>
                  <TableRow><TableCell component="th" scope="row">Привід</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center">{car.drive}</TableCell>)}</TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}><TableCell component="th" scope="row">Місто</TableCell>{compCarsData.map(car => <TableCell key={car.id} align="center">{car.city}</TableCell>)}</TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenCompModal(false)}>Закрити</Button></DialogActions>
      </Dialog>
    </>
  );
}