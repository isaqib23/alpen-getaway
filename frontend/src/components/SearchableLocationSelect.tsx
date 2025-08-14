import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Chip
} from '@mui/material'
import { LocationOn, Search } from '@mui/icons-material'
import * as RouteLocationService from '../services/RouteLocationService'

// Simple debounce utility
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
}

interface SearchableLocationSelectProps {
  value?: string
  onChange: (value: string | null) => void
  label: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  fullWidth?: boolean
  required?: boolean
}

const SearchableLocationSelect: React.FC<SearchableLocationSelectProps> = ({
  value = '',
  onChange,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText = '',
  fullWidth = true,
  required = false
}) => {
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [initialized, setInitialized] = useState(false)

  // Search function
  const searchLocations = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim() && initialized) return
    
    setLoading(true)
    try {
      const locations = searchTerm.trim()
        ? await RouteLocationService.searchLocations(searchTerm)
        : await RouteLocationService.getInitialLocations()
      
      setOptions(locations)
    } catch (error) {
      console.error('Error loading locations:', error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [initialized])

  // Debounced search function
  const debouncedSearch = useDebounce(searchLocations, 300)

  // Load initial locations when component mounts
  useEffect(() => {
    const loadInitialLocations = async () => {
      setLoading(true)
      try {
        const locations = await RouteLocationService.getInitialLocations()
        setOptions(locations)
        setInitialized(true)
      } catch (error) {
        console.error('Error loading initial locations:', error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    loadInitialLocations()
  }, [])

  // Handle input change for search
  useEffect(() => {
    if (initialized) {
      debouncedSearch(inputValue)
    }
  }, [inputValue, debouncedSearch, initialized])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      // Cleanup handled by useDebounce hook
    }
  }, [])

  return (
    <Autocomplete
      fullWidth={fullWidth}
      value={value || null}
      onChange={(_, newValue) => {
        onChange(newValue)
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      options={options}
      loading={loading}
      disabled={disabled}
      freeSolo={false} // Only allow selection from options
      autoComplete
      autoHighlight
      filterOptions={(x) => x} // Disable built-in filtering, we handle it server-side
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || 'Start typing to search...'}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <LocationOn color="action" fontSize="small" />
              </Box>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <Search color="action" fontSize="small" />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="action" fontSize="small" />
          <span>{option}</span>
        </Box>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            icon={<LocationOn />}
            variant="outlined"
            size="small"
          />
        ))
      }
      noOptionsText={
        loading ? 'Loading locations...' : 
        inputValue.trim() ? 'No locations found' : 'Type to search locations'
      }
      loadingText="Searching locations..."
      sx={{
        '& .MuiAutocomplete-input': {
          fontSize: '16px',
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
        }
      }}
    />
  )
}

export default SearchableLocationSelect