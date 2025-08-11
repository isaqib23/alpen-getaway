import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  AccountBalance as BankIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  Language as LanguageIcon
} from '@mui/icons-material'

import { usePaymentMethods } from '../../hooks/useFinancial'
import { 
  PaymentMethodConfig, 
  PaymentMethod,
  BankTransferType,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto
} from '../../api/financial'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stripe-tabpanel-${index}`}
      aria-labelledby={`stripe-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PaymentMethods = () => {
  const {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod
  } = usePaymentMethods()

  // Local state for UI
  const [tabValue, setTabValue] = useState(0)
  const [showSecrets, setShowSecrets] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stripeConfig, setStripeConfig] = useState<PaymentMethodConfig | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Form state for Stripe configuration
  const [formData, setFormData] = useState<CreatePaymentMethodDto>({
    name: 'Stripe Bank Transfer',
    type: PaymentMethod.STRIPE_BANK_TRANSFER,
    is_active: true,
    config: {
      stripe_public_key: '',
      stripe_secret_key: '',
      stripe_webhook_endpoint_secret: '',
      supported_countries: ['DE', 'AT', 'CH', 'FR', 'NL', 'BE'],
      supported_currencies: ['EUR'],
      customer_balance_funding_enabled: true,
      display_name: 'Bank Transfer',
      description: 'Secure bank transfer via Stripe',
      auto_confirmation_enabled: false
    }
  })

  // Available bank transfer types with descriptions
  const bankTransferTypes = [
    { value: BankTransferType.SEPA_DEBIT, label: 'SEPA Debit', description: 'Direct debit payments in SEPA countries' },
    { value: BankTransferType.SOFORT, label: 'Sofort', description: 'Real-time bank transfers in Germany/Austria' },
    { value: BankTransferType.IDEAL, label: 'iDEAL', description: 'Netherlands bank transfer method' },
    { value: BankTransferType.GIROPAY, label: 'Giropay', description: 'German online banking method' },
    { value: BankTransferType.BANCONTACT, label: 'Bancontact', description: 'Belgium payment method' },
    { value: BankTransferType.EPS, label: 'EPS', description: 'Austria online bank transfer' },
    { value: BankTransferType.PRZELEWY24, label: 'Przelewy24', description: 'Poland online banking' },
    { value: BankTransferType.FPX, label: 'FPX', description: 'Malaysia online banking' },
    { value: BankTransferType.ACH_DEBIT, label: 'ACH Debit', description: 'US bank account debits' },
    { value: BankTransferType.ACH_CREDIT, label: 'ACH Credit', description: 'US bank account credits' },
    { value: BankTransferType.US_BANK_ACCOUNT, label: 'US Bank Account', description: 'Direct US bank transfers' },
    { value: BankTransferType.CUSTOMER_BALANCE, label: 'Customer Balance', description: 'Stripe customer balance funding' }
  ]

  const supportedCountries = [
    { code: 'DE', name: 'Germany' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'PL', name: 'Poland' },
    { code: 'MY', name: 'Malaysia' }
  ]

  const supportedCurrencies = [
    { code: 'EUR', name: 'Euro' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'MYR', name: 'Malaysian Ringgit' }
  ]

  // Load data on mount and find existing Stripe configuration
  useEffect(() => {
    const loadConfiguration = async () => {
      await fetchPaymentMethods()
    }
    loadConfiguration()
  }, [])

  // Update form data when payment methods are loaded
  useEffect(() => {
    if (paymentMethods.length > 0) {
      const existing = paymentMethods.find(pm => pm.type === PaymentMethod.STRIPE_BANK_TRANSFER)
      if (existing) {
        setStripeConfig(existing)
        setFormData({
          name: existing.name,
          type: existing.type,
          is_active: existing.is_active,
          config: existing.config || {}
        })
      }
    }
  }, [paymentMethods])

  const handleRefresh = async () => {
    await fetchPaymentMethods()
  }

  const handleSaveConfiguration = async () => {
    setSaving(true)
    try {
      let result = null
      
      if (stripeConfig?.id) {
        // Update existing configuration
        const updateData: UpdatePaymentMethodDto = {
          name: formData.name,
          type: formData.type,
          is_active: formData.is_active,
          config: formData.config
        }
        result = await updatePaymentMethod(stripeConfig.id, updateData)
      } else {
        // Create new configuration
        result = await createPaymentMethod(formData)
      }
      
      if (result) {
        setIsDirty(false)
        await fetchPaymentMethods() // Reload to get the latest data
      }
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    if (field.startsWith('config.')) {
      const configField = field.replace('config.', '')
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [configField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    setIsDirty(true)
  }

  const handleToggleActive = () => {
    handleFieldChange('is_active', !formData.is_active)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const isConfigurationValid = () => {
    const config = formData.config
    return !!
      config?.stripe_public_key &&
      config?.stripe_secret_key &&
      config?.supported_countries?.length &&
      config?.supported_currencies?.length
  }

  const getConfigurationStatus = () => {
    if (!stripeConfig) {
      return { status: 'not_configured', label: 'Not Configured', color: 'error' }
    }
    if (!stripeConfig.is_active) {
      return { status: 'disabled', label: 'Disabled', color: 'warning' }
    }
    if (!isConfigurationValid()) {
      return { status: 'incomplete', label: 'Incomplete Configuration', color: 'warning' }
    }
    return { status: 'active', label: 'Active & Configured', color: 'success' }
  }

  const configStatus = getConfigurationStatus()

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Stripe Configuration
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Configure Stripe bank transfer payment processing for your platform
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfiguration}
            disabled={saving || !isDirty || !isConfigurationValid()}
          >
            {saving ? <CircularProgress size={20} /> : 'Save Configuration'}
          </Button>
        </Box>
      </Box>

      {/* Configuration Status Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Configuration Status
                  </Typography>
                  <Chip
                    icon={configStatus.status === 'active' ? <CheckIcon /> : <WarningIcon />}
                    label={configStatus.label}
                    color={configStatus.color as any}
                    size="medium"
                  />
                </Box>
                <SettingsIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Payment Method
                  </Typography>
                  <Typography variant="h6">
                    Stripe Bank Transfer
                  </Typography>
                </Box>
                <BankIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Supported Countries
                  </Typography>
                  <Typography variant="h5">
                    {formData.config?.supported_countries?.length || 0}
                  </Typography>
                </Box>
                <PublicIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="stripe configuration tabs">
          <Tab 
            icon={<SettingsIcon />} 
            label="Basic Configuration" 
            id="stripe-tab-0"
            aria-controls="stripe-tabpanel-0"
          />
          <Tab 
            icon={<SecurityIcon />} 
            label="API Keys & Security" 
            id="stripe-tab-1"
            aria-controls="stripe-tabpanel-1"
          />
          <Tab 
            icon={<LanguageIcon />} 
            label="Supported Regions" 
            id="stripe-tab-2"
            aria-controls="stripe-tabpanel-2"
          />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          {/* Basic Configuration Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      General Settings
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Configuration Name"
                          value={formData.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          helperText="A descriptive name for this payment configuration"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Display Name"
                          value={formData.config?.display_name || ''}
                          onChange={(e) => handleFieldChange('config.display_name', e.target.value)}
                          helperText="Name shown to customers during checkout"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={3}
                          value={formData.config?.description || ''}
                          onChange={(e) => handleFieldChange('config.description', e.target.value)}
                          helperText="Description of the payment method for customers"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.is_active}
                              onChange={handleToggleActive}
                            />
                          }
                          label="Enable Stripe Bank Transfer"
                        />
                        <FormHelperText>
                          When enabled, customers can pay using bank transfer methods
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <BankIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Bank Transfer Options
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.config?.customer_balance_funding_enabled || false}
                              onChange={(e) => handleFieldChange('config.customer_balance_funding_enabled', e.target.checked)}
                            />
                          }
                          label="Enable Customer Balance Funding"
                        />
                        <FormHelperText>
                          Allow customers to fund their Stripe customer balance
                        </FormHelperText>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.config?.auto_confirmation_enabled || false}
                              onChange={(e) => handleFieldChange('config.auto_confirmation_enabled', e.target.checked)}
                            />
                          }
                          label="Auto-confirm Payments"
                        />
                        <FormHelperText>
                          Automatically confirm payments when possible
                        </FormHelperText>
                      </Grid>
                    </Grid>
                    
                    {configStatus.status !== 'not_configured' && Boolean(stripeConfig) && (
                      <Box mt={3}>
                        <Alert severity={configStatus.color as any} icon={<InfoIcon />}>
                          <Typography variant="subtitle2" gutterBottom>
                            Configuration Status: {configStatus.label}
                          </Typography>
                          {stripeConfig?.updated_at && (
                            <Typography variant="body2">
                              Last updated: {new Date(stripeConfig.updated_at).toLocaleString()}
                            </Typography>
                          )}
                        </Alert>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* API Keys & Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Security Notice
                  </Typography>
                  Keep your Stripe API keys secure. Never share them publicly or commit them to version control.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Stripe API Credentials
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Publishable Key"
                          value={formData.config?.stripe_public_key || ''}
                          onChange={(e) => handleFieldChange('config.stripe_public_key', e.target.value)}
                          placeholder="pk_live_..."
                          helperText="Your Stripe publishable key (starts with pk_)"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Secret Key"
                          type={showSecrets ? 'text' : 'password'}
                          value={formData.config?.stripe_secret_key || ''}
                          onChange={(e) => handleFieldChange('config.stripe_secret_key', e.target.value)}
                          placeholder="sk_live_..."
                          helperText="Your Stripe secret key (starts with sk_)"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowSecrets(!showSecrets)}
                                  edge="end"
                                >
                                  {showSecrets ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Webhook Endpoint Secret"
                          type={showSecrets ? 'text' : 'password'}
                          value={formData.config?.stripe_webhook_endpoint_secret || ''}
                          onChange={(e) => handleFieldChange('config.stripe_webhook_endpoint_secret', e.target.value)}
                          placeholder="whsec_..."
                          helperText="Your Stripe webhook endpoint secret (starts with whsec_)"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowSecrets(!showSecrets)}
                                  edge="end"
                                >
                                  {showSecrets ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Setup Instructions
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Typography variant="body2" fontWeight="bold">1.</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary="Get API Keys"
                          secondary="Log in to your Stripe dashboard and navigate to Developers > API keys"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Typography variant="body2" fontWeight="bold">2.</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary="Copy Keys"
                          secondary="Copy your publishable key (pk_) and secret key (sk_)"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Typography variant="body2" fontWeight="bold">3.</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary="Setup Webhook"
                          secondary="Create a webhook endpoint for payment events"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <Typography variant="body2" fontWeight="bold">4.</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary="Test Configuration"
                          secondary="Use Stripe's test mode first, then switch to live keys"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Supported Regions Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Supported Countries
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel>Select Countries</InputLabel>
                      <Select
                        multiple
                        value={formData.config?.supported_countries || []}
                        onChange={(e) => handleFieldChange('config.supported_countries', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((code) => {
                              const country = supportedCountries.find(c => c.code === code)
                              return (
                                <Chip
                                  key={code}
                                  label={`${code} - ${country?.name}`}
                                  size="small"
                                />
                              )
                            })}
                          </Box>
                        )}
                      >
                        {supportedCountries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.code} - {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Select the countries where bank transfers will be accepted
                      </FormHelperText>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Supported Currencies
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel>Select Currencies</InputLabel>
                      <Select
                        multiple
                        value={formData.config?.supported_currencies || []}
                        onChange={(e) => handleFieldChange('config.supported_currencies', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((code) => {
                              const currency = supportedCurrencies.find(c => c.code === code)
                              return (
                                <Chip
                                  key={code}
                                  label={`${code} - ${currency?.name}`}
                                  size="small"
                                />
                              )
                            })}
                          </Box>
                        )}
                      >
                        {supportedCurrencies.map((currency) => (
                          <MenuItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Select the currencies that will be supported for bank transfers
                      </FormHelperText>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Available Bank Transfer Types
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {bankTransferTypes.map((type) => (
                        <Grid item xs={12} sm={6} md={4} key={type.value}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {type.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Bank transfer types are automatically enabled based on your supported countries and currencies.
                      Stripe will present the appropriate options to customers during checkout.
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
      {/* Save notification */}
      {isDirty && (
        <Box
          position="fixed"
          bottom={16}
          right={16}
          zIndex={1000}
        >
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleSaveConfiguration}
                disabled={saving || !isConfigurationValid()}
              >
                Save Changes
              </Button>
            }
          >
            You have unsaved changes
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default PaymentMethods
