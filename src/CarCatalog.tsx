import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Box, Typography, Grid, Pagination,
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite'; 
import BalanceIcon from '@mui/icons-material/Balance';

import { mockCars } from './mockData';
import CarCard from './components/CarCard';
import Header from './components/Header';
import Modals from './components/Modals';
import FilterBar from './components/FilterBar';

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
      
      {/* 1. КОМПОНЕНТ HEADER */}
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

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

        {/* БЛОК ФИЛЬТРОВ */}
        <FilterBar 
          markFilter={markFilter} handleMarkChange={handleMarkChange} uniqueMarks={uniqueMarks}
          modelFilter={modelFilter} handleModelChange={handleModelChange} availableModels={availableModels}
          sortBy={sortBy} handleSortChange={handleSortChange}
          showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced} handleResetFilters={handleResetFilters}
          transmissionFilter={transmissionFilter} handleTransmChange={handleTransmChange} uniqueTransmissions={uniqueTransmissions}
          fuelFilter={fuelFilter} handleFuelChange={handleFuelChange} uniqueFuels={uniqueFuels}
          yearRange={yearRange} handleYearInput={handleYearInput} handleYearBlur={handleYearBlur} minDataYear={minDataYear} maxDataYear={maxDataYear}
          priceRange={priceRange} handlePriceInput={handlePriceInput} handlePriceBlur={handlePriceBlur} handlePriceSliderChange={handlePriceSliderChange}
        />

        {/* СЕТКА КАРТОЧЕК */}
        {currentCars.length === 0 ? (
          <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mt: 10 }}>За вашими параметрами нічого не знайдено</Typography>
        ) : (
          <Grid container spacing={3}>
            {currentCars.map((car) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={car.id}>
                <CarCard 
                  car={car} 
                  isFavorite={favorites.includes(car.id)} 
                  isCompared={compare.includes(car.id)} 
                  onToggleFavorite={toggleFavorite} 
                  onToggleCompare={toggleCompare} 
                />
              </Grid>
            ))}
          </Grid>
        )}

        {filteredCars.length > 0 && (
          <Box display="flex" justifyContent="center" mt={6} pb={4}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" />
          </Box>
        )}
      </Box>

      {/* КОМПОНЕНТ MODALS */}
      <Modals 
        openFavModal={openFavModal} setOpenFavModal={setOpenFavModal}
        openCompModal={openCompModal} setOpenCompModal={setOpenCompModal}
        favCarsData={favCarsData} compCarsData={compCarsData}
        toggleFavorite={toggleFavorite} toggleCompare={toggleCompare}
      />

    </ThemeProvider>
  );
}