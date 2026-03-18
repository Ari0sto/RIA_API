import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Box, Typography, Grid, Card, CardMedia, 
  CardContent, Stack, Pagination,
  Paper, Slider, TextField, InputAdornment, MenuItem, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Иконка для кнопки поиска
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // Иконка для кнопки сброса
import { mockCars } from './mockData';

const darkOrangeTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#121212', paper: '#1E1E1E' }, primary: { main: '#FF6B00' } },
  shape: { borderRadius: 16 },
});

const ITEMS_PER_PAGE = 6;
const currentYear = new Date().getFullYear();

const uniqueMarks = Array.from(new Set(mockCars.map(car => car.markName)));

export default function CarCatalog() {
  const [page, setPage] = React.useState(1);
  
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 50000]);
  const [markFilter, setMarkFilter] = React.useState<string>('Все');
  const [yearRange, setYearRange] = React.useState<number[]>([1990, currentYear]); 
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('cheap');

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPage = () => setPage(1);

  //  ОБРАБОТЧИКИ ВВОДА
  const handlePriceSliderChange = (event: Event, newValue: number | number[]) => { setPriceRange(newValue as number[]); resetPage(); };
  const handleMarkChange = (event: React.ChangeEvent<HTMLInputElement>) => { setMarkFilter(event.target.value); resetPage(); };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(event.target.value); resetPage(); };
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => { setSortBy(event.target.value); resetPage(); };
  
  const handlePriceInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...priceRange];
    newRange[index] = event.target.value === '' ? 0 : Number(event.target.value);
    setPriceRange(newRange);
    resetPage();
  };

  const handleYearInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...yearRange];
    newRange[index] = event.target.value === '' ? (index === 0 ? 1990 : currentYear) : Number(event.target.value);
    setYearRange(newRange);
    resetPage();
  };

  // ЛОГИКА ВАЛИДАЦИИ (onBlur)
  const handlePriceBlur = () => {
    if (priceRange[0] > priceRange[1]) {
      setPriceRange([priceRange[1], priceRange[0]]); // Меняем местами, если От > До
    }
  };

  const handleYearBlur = () => {
    if (yearRange[0] > yearRange[1]) {
      setYearRange([yearRange[1], yearRange[0]]);
    }
  };

  // СБРОС ФИЛЬТРОВ
  const handleResetFilters = () => {
    setPriceRange([0, 50000]);
    setMarkFilter('Все');
    setYearRange([1990, currentYear]);
    setSearchQuery('');
    setSortBy('cheap');
    setPage(1);
  };

  // ФИЛЬТРАЦИЯ И СОРТИРОВКА
  const filteredCars = mockCars.filter((car) => {
    const minPrice = Math.min(priceRange[0], priceRange[1]);
    const maxPrice = Math.max(priceRange[0], priceRange[1]);
    const matchPrice = car.priceUSD >= minPrice && car.priceUSD <= maxPrice;

    const matchMark = markFilter === 'Все' || car.markName === markFilter;
    
    const minYear = Math.min(yearRange[0], yearRange[1]);
    const maxYear = Math.max(yearRange[0], yearRange[1]);
    const matchYear = car.year >= minYear && car.year <= maxYear;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${car.markName} ${car.modelName}`.toLowerCase();
    const matchSearch = fullName.includes(query);
    
    return matchPrice && matchMark && matchYear && matchSearch;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'cheap') return a.priceUSD - b.priceUSD;
    if (sortBy === 'expensive') return b.priceUSD - a.priceUSD;
    if (sortBy === 'newest') return b.year - a.year;
    return 0;
  });

  const totalPages = Math.ceil(sortedCars.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentCars = sortedCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <ThemeProvider theme={darkOrangeTheme}>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 4 }}>
          DNIPRO <Box component="span" sx={{ color: 'primary.main' }}>CARS</Box>
        </Typography>

        <Grid container spacing={4}>
          {/* САЙДБАР С ФИЛЬТРАМИ */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>Фильтры</Typography>
              
              <Box sx={{ mb: 4 }}>
                <TextField select fullWidth label="Марка авто" value={markFilter} onChange={handleMarkChange} variant="outlined" size="small">
                  <MenuItem value="Все"><em>Все марки</em></MenuItem>
                  {uniqueMarks.map((mark) => <MenuItem key={mark} value={mark}>{mark}</MenuItem>)}
                </TextField>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Год выпуска</Typography>
                <Stack direction="row" spacing={2}>
                  {/* onBlur для валидации */}
                  <TextField label="От" variant="outlined" size="small" type="number" value={yearRange[0] === 1990 ? '' : yearRange[0]} onChange={handleYearInputChange(0)} onBlur={handleYearBlur} />
                  <TextField label="До" variant="outlined" size="small" type="number" value={yearRange[1] === currentYear ? '' : yearRange[1]} onChange={handleYearInputChange(1)} onBlur={handleYearBlur} />
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Цена (USD)</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <TextField label="От" variant="outlined" size="small" value={priceRange[0]} onChange={handlePriceInputChange(0)} onBlur={handlePriceBlur} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                  <TextField label="До" variant="outlined" size="small" value={priceRange[1]} onChange={handlePriceInputChange(1)} onBlur={handlePriceBlur} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Stack>
                <Slider value={priceRange} onChange={handlePriceSliderChange} min={0} max={50000} step={500} color="primary" />
              </Box>

              <Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ mt: 3, textAlign: 'center' }}>
                Найдено авто: {filteredCars.length}
              </Typography>

              {/* КНОПКА СБРОСА */}
              <Button 
                variant="outlined" 
                color="inherit" 
                fullWidth 
                startIcon={<RestartAltIcon />} 
                onClick={handleResetFilters}
                sx={{ mt: 3, borderColor: '#333', color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
              >
                Сбросить фильтры
              </Button>
            </Paper>
          </Grid>

          {/* ПРАВАЯ ЧАСТЬ */}
          <Grid size={{ xs: 12, md: 9 }}>
            
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField fullWidth variant="outlined" placeholder="Поиск по модели (напр. X5, Tiguan...)" value={searchQuery} onChange={handleSearchChange} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary"/></InputAdornment> }} sx={{ flexGrow: 1, minWidth: '250px' }} />
              <TextField select label="Сортировка" value={sortBy} onChange={handleSortChange} sx={{ minWidth: '200px' }}>
                <MenuItem value="cheap">Сначала дешевые</MenuItem>
                <MenuItem value="expensive">Сначала дорогие</MenuItem>
                <MenuItem value="newest">Сначала новые</MenuItem>
              </TextField>
            </Paper>

            {currentCars.length === 0 ? (
              <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mt: 10 }}>По вашим параметрам ничего не найдено</Typography>
            ) : (
              <Grid container spacing={3}>
                {currentCars.map((car) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={car.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 107, 0, 0.2)' } }}>
                      <CardMedia component="img" height="200" image={car.photoUrl} alt={`${car.markName} ${car.modelName}`} sx={{ objectFit: 'cover' }} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>{car.markName} {car.modelName} {car.year}</Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>{car.priceUSD.toLocaleString()} $</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{car.priceUAH.toLocaleString()} грн</Typography>
                        <Typography variant="body2" color="text.secondary">Пробег: {car.mileage} тыс. км</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {filteredCars.length > 0 && (
              <Box display="flex" justifyContent="center" mt={6} pb={4}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" sx={{ '& .MuiPaginationItem-root': { color: 'white' } }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}