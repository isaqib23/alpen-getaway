import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { routesAPI } from '../../api/routes';
import { carsAPI } from '../../api/cars';
import { driversAPI } from '../../api/drivers';
import { usersAPI } from '../../api/users';

interface BookingFormData {
  route_id?: string;
  from_location?: string;
  to_location?: string;
  pickup_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  car_id?: string;
  driver_id?: string;
  user_id?: string;
  notes?: string;
  passenger_count?: number;
  fare_amount?: number;
  status?: string;
}

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  initialData?: Partial<BookingFormData>;
  mode: 'admin' | 'partner';
  title?: string;
  loading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  mode,
  title = 'Add New Booking',
  loading = false
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickup_time: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    passenger_count: 1,
    notes: '',
    ...initialData
  });

  const [routes, setRoutes] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const loadInitialData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      // Load routes for dropdown
      const routesResponse = await routesAPI.getAll();
      setRoutes(routesResponse.data || []);

      if (mode === 'admin') {
        // Admin can see all cars, drivers, and customers
        const [carsResponse, driversResponse, customersResponse] = await Promise.all([
          carsAPI.getAll(),
          driversAPI.getAll(),
          usersAPI.getUsers({ userType: 'customer' })
        ]);
        
        setCars(carsResponse.data || []);
        setDrivers(driversResponse.data || []);
        setCustomers(customersResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [mode]);

  useEffect(() => {
    if (open) {
      loadInitialData();
      
      // Reset form data with initial data when dialog opens
      setFormData({
        pickup_time: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        passenger_count: 1,
        notes: '',
        ...initialData
      });
    }
  }, [open, loadInitialData]);

  const handleRouteChange = (route: any) => {
    setSelectedRoute(route);
    if (route) {
      setFormData(prev => ({
        ...prev,
        route_id: route.id,
        from_location: route.from_location,
        to_location: route.to_location,
        fare_amount: route.base_fare
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: BookingFormData = {
      ...formData,
      pickup_time: formData.pickup_time,
      status: mode === 'partner' ? 'pending_approval' : 'confirmed'
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof BookingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target ? event.target.value : event;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {loadingData ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Route Selection */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Route Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    options={routes}
                    getOptionLabel={(option) => `${option.from_location} → ${option.to_location}`}
                    value={selectedRoute}
                    onChange={(_, newValue) => handleRouteChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Route"
                        required
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">
                            {option.from_location} → {option.to_location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Base Fare: ${option.base_fare} • Distance: {option.distance_km}km
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Grid>

                {selectedRoute && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">From</Typography>
                          <Typography variant="body1">{selectedRoute.from_location}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">To</Typography>
                          <Typography variant="body1">{selectedRoute.to_location}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Distance</Typography>
                          <Typography variant="body1">{selectedRoute.distance_km} km</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Base Fare</Typography>
                          <Typography variant="body1">${selectedRoute.base_fare}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}

                {/* Booking Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Booking Details
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Pickup Date & Time"
                    type="datetime-local"
                    value={formData.pickup_time ? new Date(formData.pickup_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        pickup_time: e.target.value ? new Date(e.target.value).toISOString() : ''
                      }));
                    }}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Number of Passengers"
                    type="number"
                    value={formData.passenger_count}
                    onChange={handleInputChange('passenger_count')}
                    fullWidth
                    inputProps={{ min: 1, max: 8 }}
                  />
                </Grid>

                {/* Customer Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Customer Information
                  </Typography>
                </Grid>

                {mode === 'admin' && customers.length > 0 && (
                  <Grid item xs={12}>
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setFormData(prev => ({
                            ...prev,
                            user_id: newValue.id,
                            customer_name: `${newValue.first_name} ${newValue.last_name}`,
                            customer_email: newValue.email,
                            customer_phone: newValue.phone || ''
                          }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Existing Customer (Optional)"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Name"
                    value={formData.customer_name}
                    onChange={handleInputChange('customer_name')}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange('customer_phone')}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange('customer_email')}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Admin-only fields */}
                {mode === 'admin' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Assignment (Optional)
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Assign Car</InputLabel>
                        <Select
                          value={formData.car_id || ''}
                          onChange={handleInputChange('car_id')}
                          label="Assign Car"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {cars.map((car) => (
                            <MenuItem key={car.id} value={car.id}>
                              {car.make} {car.model} ({car.license_plate})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Assign Driver</InputLabel>
                        <Select
                          value={formData.driver_id || ''}
                          onChange={handleInputChange('driver_id')}
                          label="Assign Driver"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {drivers.map((driver) => (
                            <MenuItem key={driver.id} value={driver.id}>
                              {driver.first_name} {driver.last_name} ({driver.license_number})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status || 'pending'}
                          onChange={handleInputChange('status')}
                          label="Status"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="confirmed">Confirmed</MenuItem>
                          <MenuItem value="assigned">Assigned</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Fare Amount"
                        type="number"
                        value={formData.fare_amount || ''}
                        onChange={handleInputChange('fare_amount')}
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange('notes')}
                    fullWidth
                  />
                </Grid>

                {mode === 'partner' && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="info.contrastText">
                        ℹ️ Your booking will be submitted for approval. You'll receive a notification once it's reviewed.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingData}
        >
          {loading ? <CircularProgress size={20} /> : 'Submit Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};