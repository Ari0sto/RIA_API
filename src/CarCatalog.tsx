import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Box, Typography, Grid, Card, CardMedia, 
  CardContent, Stack, Pagination,
  Paper, Slider, TextField, InputAdornment, MenuItem
} from '@mui/material';
import { mockCars } from './mockData';

// Кастомная темная тема
const darkOrangeTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#FF6B00',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    }
  },
  shape: {
    borderRadius: 16,
  },
});

const ITEMS_PER_PAGE = 5; // Для теста пагинации

// Вытягиваем уникальные марки из нашего массива данных
const uniqueMarks = Array.from(new Set(mockCars.map(car => car.markName)));

export default function CarCatalog() {
  const [page, setPage] = React.useState(1);
  
  // СОСТОЯНИЯ ФИЛЬТРОВ 
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 20000]);
  const [markFilter, setMarkFilter] = React.useState<string>('Все'); // По умолчанию показываем все
  const [yearRange, setYearRange] = React.useState<number[]>([1990, new Date().getFullYear()]); 

  // ОБРАБОТЧИКИ 
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setPage(1);
  };

  const handlePriceInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...priceRange];
    newRange[index] = event.target.value === '' ? 0 : Number(event.target.value);
    setPriceRange(newRange);
    setPage(1);
  };

  const handleMarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarkFilter(event.target.value);
    setPage(1);
  };

  const handleYearInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...yearRange];
    newRange[index] = event.target.value === '' ? (index === 0 ? 1900 : new Date().getFullYear()) : Number(event.target.value);
    setYearRange(newRange);
    setPage(1);
  };

  // ЛОГИКА ФИЛЬТРАЦИИ 
  const filteredCars = mockCars.filter((car) => {
    // 1. Проверка цены
    const matchPrice = car.priceUSD >= priceRange[0] && car.priceUSD <= priceRange[1];
    // 2. Проверка марки
    const matchMark = markFilter === 'Все' || car.markName === markFilter;
    // 3. Проверка года
    const matchYear = car.year >= yearRange[0] && car.year <= yearRange[1];
    
    // Машина попадет в список, только если проходит ВСЕ три фильтра
    return matchPrice && matchMark && matchYear;
  });

  // ПАГИНАЦИЯ
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  return (
    <ThemeProvider theme={darkOrangeTheme}>
      <CssBaseline />
      
      <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 4 }}>
          АВТО В <Box component="span" sx={{ color: 'primary.main' }}>ДНЕПРЕ</Box>
        </Typography>

        <Grid container spacing={4}>
          {/* САЙДБАР С ФИЛЬТРАМИ */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Фильтры
              </Typography>
              
              {/* 1. ФИЛЬТР МАРКИ */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Марка авто"
                  value={markFilter}
                  onChange={handleMarkChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Все">
                    <em>Все марки</em>
                  </MenuItem>
                  {uniqueMarks.map((mark) => (
                    <MenuItem key={mark} value={mark}>
                      {mark}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* 2. ФИЛЬТР ГОДА */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Год выпуска
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField 
                    label="От" 
                    variant="outlined" 
                    size="small"
                    type="number"
                    value={yearRange[0] === 1990 ? '' : yearRange[0]}
                    onChange={handleYearInputChange(0)}
                  />
                  <TextField 
                    label="До" 
                    variant="outlined" 
                    size="small"
                    type="number"
                    value={yearRange[1] === new Date().getFullYear() ? '' : yearRange[1]}
                    onChange={handleYearInputChange(1)}
                  />
                </Stack>
              </Box>

              {/* 3. ФИЛЬТР ЦЕНЫ */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Цена (USD)
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <TextField 
                    label="От" 
                    variant="outlined" 
                    size="small"
                    value={priceRange[0]}
                    onChange={handlePriceInputChange(0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  <TextField 
                    label="До" 
                    variant="outlined" 
                    size="small"
                    value={priceRange[1]}
                    onChange={handlePriceInputChange(1)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Stack>

                <Slider
                  value={priceRange}
                  onChange={handlePriceSliderChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={30000} 
                  step={500}
                  color="primary"
                />
              </Box>

              {/* СТАТИСТИКА ФИЛЬТРА */}
              <Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ mt: 3, textAlign: 'center' }}>
                Найдено авто: {filteredCars.length}
              </Typography>
            </Paper>
          </Grid>

          {/* СПИСОК МАШИН */}
          <Grid size={{ xs: 12, md: 9 }}>
            {currentCars.length === 0 ? (
              <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mt: 10 }}>
                По вашим фильтрам ничего не найдено
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {currentCars.map((car) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={car.id}>
                    <Card sx={{ 
                      height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 107, 0, 0.2)' }
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={car.photoUrl}
                        alt={`${car.markName} ${car.modelName}`}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {car.markName} {car.modelName} {car.year}
                        </Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>
                          {car.priceUSD.toLocaleString()} $
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {car.priceUAH.toLocaleString()} грн
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Пробег: {car.mileage} тыс. км
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Пагинация */}
            {filteredCars.length > 0 && (
              <Box display="flex" justifyContent="center" mt={6} pb={4}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                  sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}