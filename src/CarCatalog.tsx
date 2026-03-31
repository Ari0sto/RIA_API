import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Box, Typography, Grid, Card, CardMedia, 
  CardContent, Stack, Pagination,
  Paper, TextField, InputAdornment, MenuItem, Button, Divider, IconButton, Collapse, Slider,
  Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune'; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import BalanceIcon from '@mui/icons-material/Balance';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { mockCars } from './mockData';

const darkOrangeTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#121212', paper: '#1E1E1E' }, primary: { main: '#FF6B00' } },
  shape: { borderRadius: 12 },
});

const ITEMS_PER_PAGE = 6;

const uniqueMarks = Array.from(new Set(mockCars.map(car => car.markName)));
const uniqueTransmissions = Array.from(new Set(mockCars.map(car => car.transmission)));
const uniqueFuels = Array.from(new Set(mockCars.map(car => car.fuelAndVolume.split(',')[0].trim())));

const allYears = mockCars.map(car => car.year);
const minDataYear = Math.min(...allYears);
const maxDataYear = Math.max(...allYears);

export default function CarCatalog() {
  const [page, setPage] = React.useState(1);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const [openFavModal, setOpenFavModal] = React.useState(false);
  const [openCompModal, setOpenCompModal] = React.useState(false);

  const [favorites, setFavorites] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('carsHub_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [compare, setCompare] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('carsHub_compare');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => { localStorage.setItem('carsHub_favorites', JSON.stringify(favorites)); }, [favorites]);
  React.useEffect(() => { localStorage.setItem('carsHub_compare', JSON.stringify(compare)); }, [compare]);

  const toggleFavorite = (id: number) => { setFavorites(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]); };
  const toggleCompare = (id: number) => { setCompare(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]); };

  const [markFilter, setMarkFilter] = React.useState<string>('Все');
  const [modelFilter, setModelFilter] = React.useState<string>('Все'); 
  const [transmissionFilter, setTransmissionFilter] = React.useState<string>('Все');
  const [fuelFilter, setFuelFilter] = React.useState<string>('Все');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('cheap');
  
  const [priceRange, setPriceRange] = React.useState<(number | string)[]>([0, 50000]);
  const [yearRange, setYearRange] = React.useState<(number | string)[]>([minDataYear, maxDataYear]); 

  const handlePageChange = (_e: any, value: number) => { setPage(value); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetPage = () => setPage(1);

  const handleMarkChange = (e: any) => { 
    setMarkFilter(e.target.value); 
    setModelFilter('Все'); 
    resetPage(); 
  };
  const handleModelChange = (e: any) => { setModelFilter(e.target.value); resetPage(); };
  const handleTransmChange = (e: any) => { setTransmissionFilter(e.target.value); resetPage(); };
  const handleFuelChange = (e: any) => { setFuelFilter(e.target.value); resetPage(); };
  const handleSearchChange = (e: any) => { setSearchQuery(e.target.value); resetPage(); };
  const handleSortChange = (e: any) => { setSortBy(e.target.value); resetPage(); };
  const handlePriceSliderChange = (_e: Event, newValue: number | number[]) => { setPriceRange(newValue as number[]); resetPage(); };

  const availableModels = React.useMemo(() => {
    if (markFilter === 'Все') return [];
    const models = mockCars.filter(car => car.markName === markFilter).map(car => car.modelName);
    return Array.from(new Set(models));
  }, [markFilter]);

  const handlePriceInput = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => { 
    let val: number | string = e.target.value;
    if (val !== '') {
      val = Number(val);
      if (val < 0) val = Math.abs(val); 
    }
    const r = [...priceRange]; r[idx] = val; 
    setPriceRange(r); resetPage(); 
  };

  const handleYearInput = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => { 
    let val: number | string = e.target.value;
    if (val !== '') {
      val = Number(val);
      if (val < 0) val = Math.abs(val); 
      if (val > maxDataYear) val = maxDataYear; 
    }
    const r = [...yearRange]; r[idx] = val; 
    setYearRange(r); resetPage(); 
  };

  const handlePriceBlur = () => { 
    let min = Number(priceRange[0]) || 0;
    let max = Number(priceRange[1]) || 50000;
    if (min > max) [min, max] = [max, min]; 
    setPriceRange([min, max]); 
  };

  const handleYearBlur = () => { 
    let min = Number(yearRange[0]);
    let max = Number(yearRange[1]);
    if (!min || min < minDataYear) min = minDataYear; 
    if (!max || max > maxDataYear) max = maxDataYear;
    if (min > max) [min, max] = [max, min]; 
    setYearRange([min, max]); 
  };

  const handleResetFilters = () => {
    setMarkFilter('Все'); setModelFilter('Все'); setTransmissionFilter('Все'); setFuelFilter('Все');
    setSearchQuery(''); setSortBy('cheap'); 
    setPriceRange([0, 50000]); setYearRange([minDataYear, maxDataYear]); setPage(1);
  };

  const filteredCars = mockCars.filter((car) => {
    const matchMark = markFilter === 'Все' || car.markName === markFilter;
    const matchModel = modelFilter === 'Все' || car.modelName === modelFilter;
    const matchTransm = transmissionFilter === 'Все' || car.transmission === transmissionFilter;
    const matchFuel = fuelFilter === 'Все' || car.fuelAndVolume.includes(fuelFilter);
    const matchSearch = `${car.markName} ${car.modelName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const minP = Number(priceRange[0]) || 0;
    const maxP = Number(priceRange[1]) || 999999;
    const matchPrice = car.priceUSD >= Math.min(minP, maxP) && car.priceUSD <= Math.max(minP, maxP);
    
    const minY = Number(yearRange[0]) || minDataYear;
    const maxY = Number(yearRange[1]) || maxDataYear;
    const matchYear = car.year >= Math.min(minY, maxY) && car.year <= Math.max(minY, maxY);
    
    return matchMark && matchModel && matchTransm && matchFuel && matchSearch && matchPrice && matchYear;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'cheap') return a.priceUSD - b.priceUSD;
    if (sortBy === 'expensive') return b.priceUSD - a.priceUSD;
    if (sortBy === 'newest') return b.year - a.year;
    return 0;
  });

  const totalPages = Math.ceil(sortedCars.length / ITEMS_PER_PAGE);
  const currentCars = sortedCars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const favCarsData = mockCars.filter(car => favorites.includes(car.id));
  const compCarsData = mockCars.filter(car => compare.includes(car.id));

  return (
    <ThemeProvider theme={darkOrangeTheme}>
      <CssBaseline />
      
      {/* 1. ПОЛНОЭКРАННЫЙ ЧЕРНЫЙ БАННЕР */}
      <Box sx={{ width: '100%', backgroundColor: '#000000', borderBottom: '2px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          maxWidth: '1400px', width: '100%', px: { xs: 2, md: 4 }, py: 2, 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, // Создаем 3 колонки на ПК для идеального центрирования
          alignItems: 'center', 
          gap: 2 
        }}>
          
          {/* Логотип (слева) */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Box component="img" src="/logo_l.png" alt="CARS HUB Logo" sx={{ height: { xs: '60px', md: '100px' }, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
          </Box>
          
          {/* ПОИСК (по центру) */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField 
              variant="outlined" 
              placeholder="Пошук..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary"/></InputAdornment> }} 
              size="small"
              sx={{ 
                width: { xs: '100%', md: '450px' }, // Задаем фиксированную ширину на ПК, чтобы строка не была слишком узкой
                backgroundColor: '#1E1E1E', 
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                }
              }}
            />
          </Box>

          {/* Пустой блок справа для визуального баланса */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}></Box>

        </Box>
      </Box>

      {/* 2. ОСНОВНОЙ КОНТЕЙНЕР */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3, minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* БАР НАВИГАЦИИ */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">Знайдено {filteredCars.length} лотів</Typography>

          <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, alignItems: 'center' }}>
            <Box onClick={() => setOpenFavModal(true)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: '0.2s', '&:hover': { color: 'primary.main' } }}>
              <FavoriteIcon fontSize="small" sx={{ mr: 1, color: favorites.length > 0 ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="body2" fontWeight="bold">Обрані лоти ({favorites.length})</Typography>
            </Box>

            <Box onClick={() => setOpenCompModal(true)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: '0.2s', '&:hover': { color: 'primary.main' } }}>
              <BalanceIcon fontSize="small" sx={{ mr: 1, color: compare.length > 0 ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="body2" fontWeight="bold">Порівняння ({compare.length})</Typography>
            </Box>
          </Box>
        </Box>

        {/* БЛОК ФИЛЬТРОВ (РАЗГРУЖЕННЫЙ) */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            
            {/* Теперь блоки идеально симметричны: 4 колонки по 25% (md: 3) */}
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Марка" value={markFilter} onChange={handleMarkChange} size="small">
                <MenuItem value="Все"><em>Всі</em></MenuItem>
                {uniqueMarks.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Модель" value={modelFilter} onChange={handleModelChange} size="small" disabled={markFilter === 'Все'}>
                <MenuItem value="Все"><em>Всі</em></MenuItem>
                {availableModels.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </Grid>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Сортування" value={sortBy} onChange={handleSortChange} size="small">
                <MenuItem value="cheap">Найдешевші</MenuItem>
                <MenuItem value="expensive">Найдорожчі</MenuItem>
                <MenuItem value="newest">Найновіші</MenuItem>
              </TextField>
            </Grid>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="primary" fullWidth onClick={() => setShowAdvanced(!showAdvanced)} startIcon={<TuneIcon />} sx={{ height: '40px' }}>
                  {showAdvanced ? 'Приховати' : 'Фільтри'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleResetFilters} sx={{ height: '40px', minWidth: '40px', px: 1 }} title="Скинути">
                  <RestartAltIcon />
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* ДОПОЛНИТЕЛЬНЫЕ ФИЛЬТРЫ */}
          <Collapse in={showAdvanced}>
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Grid container spacing={4}>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Коробка передач</Typography>
                  <TextField select fullWidth value={transmissionFilter} onChange={handleTransmChange} size="small">
                    <MenuItem value="Все"><em>Всі</em></MenuItem>
                    {uniqueTransmissions.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Тип палива</Typography>
                  <TextField select fullWidth value={fuelFilter} onChange={handleFuelChange} size="small">
                    <MenuItem value="Все"><em>Всі типи</em></MenuItem>
                    {uniqueFuels.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Рік випуску</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Від" variant="outlined" size="small" type="number" fullWidth value={yearRange[0]} onChange={handleYearInput(0)} onBlur={handleYearBlur} inputProps={{ min: minDataYear, max: maxDataYear }} />
                    <TextField label="До" variant="outlined" size="small" type="number" fullWidth value={yearRange[1]} onChange={handleYearInput(1)} onBlur={handleYearBlur} inputProps={{ min: minDataYear, max: maxDataYear }} />
                  </Stack>
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Ціна (USD)</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField label="Від" variant="outlined" size="small" type="number" fullWidth value={priceRange[0]} onChange={handlePriceInput(0)} onBlur={handlePriceBlur} inputProps={{ min: 0 }} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                    <TextField label="До" variant="outlined" size="small" type="number" fullWidth value={priceRange[1]} onChange={handlePriceInput(1)} onBlur={handlePriceBlur} inputProps={{ min: 0 }} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                  </Stack>
                  <Box sx={{ px: 2 }}>
                    <Slider value={typeof priceRange[0] === 'number' && typeof priceRange[1] === 'number' ? priceRange as number[] : [0, 50000]} onChange={handlePriceSliderChange} min={0} max={50000} step={500} color="primary" />
                  </Box>
                </Grid>

              </Grid>
            </Box>
          </Collapse>
        </Paper>

        {/* СЕТКА КАРТОЧЕК */}
        {currentCars.length === 0 ? (
          <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mt: 10 }}>За вашими параметрами нічого не знайдено</Typography>
        ) : (
          <Grid container spacing={3}>
            {currentCars.map((car) => {
              const isFavorite = favorites.includes(car.id);
              const isCompared = compare.includes(car.id);

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={car.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 107, 0, 0.2)' } }}>
                    
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height="220" image={car.photoUrl} alt={car.markName} sx={{ objectFit: 'cover' }} />
                      <IconButton onClick={() => toggleCompare(car.id)} sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'primary.main' } }}>
                        <BalanceIcon fontSize="small" sx={{ color: isCompared ? 'primary.main' : 'white' }}/>
                      </IconButton>
                      <IconButton onClick={() => toggleFavorite(car.id)} sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'primary.main' } }}>
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
                </Grid>
              );
            })}
          </Grid>
        )}

        {filteredCars.length > 0 && (
          <Box display="flex" justifyContent="center" mt={6} pb={4}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" />
          </Box>
        )}
      </Box>

      {/* МОДАЛЬНЫЕ ОКНА ОСТАЛИСЬ БЕЗ ИЗМЕНЕНИЙ */}
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
        <DialogActions>
          <Button onClick={() => setOpenFavModal(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>

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
                  <TableRow>
                    <TableCell component="th" scope="row">Ціна</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center"><Typography color="primary.main" fontWeight="bold">${car.priceUSD.toLocaleString()}</Typography></TableCell>)}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Пробіг</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center">{car.mileage} тис. км</TableCell>)}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Коробка</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center">{car.transmission}</TableCell>)}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Паливо</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center">{car.fuelAndVolume}</TableCell>)}
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Привід</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center">{car.drive}</TableCell>)}
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">Місто</TableCell>
                    {compCarsData.map(car => <TableCell key={car.id} align="center">{car.city}</TableCell>)}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompModal(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
}