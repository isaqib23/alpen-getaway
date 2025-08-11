import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  Popper,
  PopperProps,
} from '@mui/material';
import { routesAPI } from '../../api/routes';
import { RouteFare } from '../../types/api';

interface RouteSelectorProps {
  value?: RouteFare | null;
  onChange: (route: RouteFare | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

// Custom Popper for better performance with large lists
const CustomPopper = (props: PopperProps) => (
  <Popper {...props} style={{ width: 'auto', minWidth: '400px' }} placement="bottom-start" />
);

export const RouteSelector: React.FC<RouteSelectorProps> = ({
  value = null,
  onChange,
  label = 'Select Route',
  placeholder = 'Search routes by location...',
  required = false,
  disabled = false,
  error = false,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<RouteFare[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await routesAPI.getAll({
          search: searchTerm,
          page: 1,
          limit: 50, // Load first 50 matching routes
          is_active: true, // Only active routes
        });
        
        const routes = response?.data || [];
        setOptions(routes);
      } catch (error) {
        console.error('Failed to search routes:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Load initial popular routes when dropdown opens
  const loadInitialRoutes = useCallback(async () => {
    if (options.length > 0) return; // Already loaded

    setLoading(true);
    try {
      const response = await routesAPI.getAll({
        page: 1,
        limit: 20, // Load first 20 popular routes
        is_active: true,
        // sort_by: 'created_at', // Most recently used routes - if supported by API
        // sort_order: 'desc',
      });
      
      const routes = response?.data || [];
      setOptions(routes);
    } catch (error) {
      console.error('Failed to load initial routes:', error);
    } finally {
      setLoading(false);
    }
  }, [options.length]);

  // Handle input change for search
  useEffect(() => {
    if (open && inputValue) {
      debouncedSearch(inputValue);
    } else if (open && !inputValue) {
      loadInitialRoutes();
    }
  }, [inputValue, open, debouncedSearch, loadInitialRoutes]);

  // Custom option rendering for better performance
  const renderOption = (props: any, option: RouteFare) => (
    <Box component="li" {...props} key={option.id}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {option.from_location} → {option.to_location}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
          <Chip 
            label={option.vehicle} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            €{option.sale_fare} • {option.distance_km}km
          </Typography>
          {!option.is_active && (
            <Chip 
              label="Inactive" 
              size="small" 
              color="error" 
              variant="outlined"
            />
          )}
        </Box>
      </Box>
    </Box>
  );

  // Custom input rendering
  const getOptionLabel = (option: RouteFare) => 
    `${option.from_location} → ${option.to_location} (${option.vehicle})`;

  // Filter options based on search
  const filterOptions = (options: RouteFare[], { inputValue }: any) => {
    if (!inputValue) return options;
    
    const searchLower = inputValue.toLowerCase();
    return options.filter(option =>
      option.from_location.toLowerCase().includes(searchLower) ||
      option.to_location.toLowerCase().includes(searchLower) ||
      option.vehicle.toLowerCase().includes(searchLower)
    );
  };

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      filterOptions={filterOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      PopperComponent={CustomPopper}
      PaperComponent={({ children }) => (
        <Paper elevation={8} sx={{ maxHeight: 300, overflow: 'auto' }}>
          {children}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      noOptionsText={
        inputValue.length < 2
          ? "Type at least 2 characters to search..."
          : loading
          ? "Searching routes..."
          : "No routes found"
      }
    />
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default RouteSelector;