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
  CircularProgress
} from '@mui/material';
import { RouteSelector } from './RouteSelector';
import { carsAPI } from '../../api/cars';
import { driversAPI } from '../../api/drivers';

interface BookingFormData {
  route_id?: string;
  from_location?: string;
  to_location?: string;
  pickup_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_address: string;
  dropoff_address: string;
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
    from_location: '',
    to_location: '',
    pickup_address: '',
    dropoff_address: '',
    passenger_count: 1,
    notes: '',
    ...initialData
  });

  const [cars, setCars] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const loadInitialData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      if (mode === 'admin') {
        // Admin can see all cars and drivers
        const [carsResponse, driversResponse] = await Promise.all([
          carsAPI.getAll(),
          driversAPI.getAll()
        ]);
        
        setCars(carsResponse.data || []);
        setDrivers(driversResponse.data || []);
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
        from_location: '',
        to_location: '',
        pickup_address: '',
        dropoff_address: '',
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
        pickup_address: prev.pickup_address || route.from_location, // Keep existing if set, otherwise use route location
        dropoff_address: prev.dropoff_address || route.to_location, // Keep existing if set, otherwise use route location
        fare_amount: route.sale_fare || route.base_fare || route.original_fare
      }));
    } else {
      // Clear location fields when no route is selected
      setFormData(prev => ({
        ...prev,
        route_id: undefined,
        from_location: undefined,
        to_location: undefined,
        pickup_address: '',
        dropoff_address: '',
        fare_amount: undefined
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
                  <RouteSelector
                    value={selectedRoute}
                    onChange={handleRouteChange}
                    label="Select Route"
                    placeholder="Search routes by location..."
                    required
                    helperText="Search by typing any location name - searches both from and to locations (e.g., 'Vienna', 'Salzburg')"
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

                <Grid item xs={12}>
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange('customer_email')}
                    fullWidth
                    required
                    helperText="Enter customer email. If the email exists, we'll create a booking for them. If not, we'll create a new customer account."
                  />
                </Grid>

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

                <Grid item xs={12} md={6}>
                  <TextField
                    label="From Location"
                    value={formData.from_location || ''}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Auto-populated from selected route"
                    sx={{
                      '& .MuiInputBase-input': {
                        backgroundColor: '#f5f5f5',
                        cursor: 'not-allowed'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="To Location"
                    value={formData.to_location || ''}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Auto-populated from selected route"
                    sx={{
                      '& .MuiInputBase-input': {
                        backgroundColor: '#f5f5f5',
                        cursor: 'not-allowed'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Pickup Address"
                    value={formData.pickup_address}
                    onChange={handleInputChange('pickup_address')}
                    fullWidth
                    required
                    helperText="Specific pickup address within the from location"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Dropoff Address"
                    value={formData.dropoff_address}
                    onChange={handleInputChange('dropoff_address')}
                    fullWidth
                    required
                    helperText="Specific dropoff address within the to location"
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