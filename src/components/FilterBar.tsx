import * as React from 'react';
import { 
  Paper, Grid, TextField, MenuItem, Button, Stack, Collapse, 
  Box, Typography, InputAdornment, Slider 
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune'; 
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface FilterBarProps {
  markFilter: string;
  handleMarkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uniqueMarks: string[];
  
  modelFilter: string;
  handleModelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableModels: string[];

  sortBy: string;
  handleSortChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  handleResetFilters: () => void;

  transmissionFilter: string;
  handleTransmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uniqueTransmissions: string[];

  fuelFilter: string;
  handleFuelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uniqueFuels: string[];

  yearRange: (number | string)[];
  handleYearInput: (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleYearBlur: () => void;
  minDataYear: number;
  maxDataYear: number;

  priceRange: (number | string)[];
  handlePriceInput: (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceBlur: () => void;
  handlePriceSliderChange: (e: Event, newValue: number | number[]) => void;
}

export default function FilterBar({
  markFilter, handleMarkChange, uniqueMarks,
  modelFilter, handleModelChange, availableModels,
  sortBy, handleSortChange,
  showAdvanced, setShowAdvanced, handleResetFilters,
  transmissionFilter, handleTransmChange, uniqueTransmissions,
  fuelFilter, handleFuelChange, uniqueFuels,
  yearRange, handleYearInput, handleYearBlur, minDataYear, maxDataYear,
  priceRange, handlePriceInput, handlePriceBlur, handlePriceSliderChange
}: FilterBarProps) {
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Grid container spacing={2} alignItems="flex-end">
        
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
  );
}