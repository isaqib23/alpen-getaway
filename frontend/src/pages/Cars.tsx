import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import * as helper from "../common/helper";
import * as LocationService from "../services/LocationService";
import * as SupplierService from "../services/SupplierService";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import CarsSidebar from "../components/CarsSidebar";
import { usePageLoading } from "../common/usePageLoading";

import "../assets/css/cars.css";
import FleetsCollection from "../components/FleetsCollection";

import { strings } from "../lang/common";
import { strings as carsStrings } from "../lang/cars";

const Cars = () => {
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [pickupLocation, setPickupLocation] =
    useState<bookcarsTypes.Location>();
  const [dropOffLocation, setDropOffLocation] =
    useState<bookcarsTypes.Location>();
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [allSuppliers, setAllSuppliers] = useState<bookcarsTypes.User[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>();
  const [loading, setLoading] = useState(true);
  const [carSpecs, setCarSpecs] = useState<bookcarsTypes.CarSpecs>({});

  // Use page loading hook to manage loading state
  usePageLoading({
    taskId: 'cars-page',
    dependencies: [!loading, visible, suppliers],
  });
  const [carType, setCarType] = useState(bookcarsHelper.getAllCarTypes());
  const [gearbox, setGearbox] = useState([
    bookcarsTypes.GearboxType.Automatic,
    bookcarsTypes.GearboxType.Manual,
  ]);
  const [mileage, setMileage] = useState([
    bookcarsTypes.Mileage.Limited,
    bookcarsTypes.Mileage.Unlimited,
  ]);
  const [fuelPolicy, setFuelPolicy] = useState([
    bookcarsTypes.FuelPolicy.FreeTank,
    bookcarsTypes.FuelPolicy.LikeForlike,
  ]);
  const [deposit, setDeposit] = useState(-1);

  useEffect(() => {
    const updateSuppliers = async () => {
      if (pickupLocation) {
        const payload: bookcarsTypes.GetCarsPayload = {
          pickupLocation: pickupLocation._id,
          carSpecs,
          carType,
          gearbox,
          mileage,
          fuelPolicy,
          deposit,
        };
        const _allSuppliers = await SupplierService.getFrontendSuppliers(
          payload
        );
        setAllSuppliers(_allSuppliers);
      }
    };

    updateSuppliers();
  }, [
    pickupLocation,
    carSpecs,
    carType,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
  ]);

  const handleCarFilterSubmit = (filter: bookcarsTypes.CarFilter) => {
    setPickupLocation(filter.pickupLocation);
    setDropOffLocation(filter.dropOffLocation);
    setFrom(filter.from);
    setTo(filter.to);
  };

  const handleCarSpecsFilterChange = (value: bookcarsTypes.CarSpecs) => {
    setCarSpecs(value);
  };

  const handleSupplierFilterChange = (newSuppliers: string[]) => {
    setSuppliers(newSuppliers);
  };

  const handleCarTypeFilterChange = (values: bookcarsTypes.CarType[]) => {
    setCarType(values);
  };

  const handleGearboxFilterChange = (values: bookcarsTypes.GearboxType[]) => {
    setGearbox(values);
  };

  const handleMileageFilterChange = (values: bookcarsTypes.Mileage[]) => {
    setMileage(values);
  };

  const handleFuelPolicyFilterChange = (values: bookcarsTypes.FuelPolicy[]) => {
    setFuelPolicy(values);
  };

  const handleDepositFilterChange = (value: number) => {
    setDeposit(value);
  };

  const onLoad = async (user?: bookcarsTypes.User) => {
    const { state } = location;
    
    // If no state is provided, show fleet without search parameters
    if (!state) {
      try {
        setLoading(true);
        
        // First, try to get suppliers
        const payload: bookcarsTypes.GetCarsPayload = {
          carSpecs,
          carType,
          gearbox,
          mileage,
          fuelPolicy,
          deposit,
        };
        
        try {
          const _allSuppliers = await SupplierService.getFrontendSuppliers(payload);
          const _suppliers = bookcarsHelper.flattenSuppliers(_allSuppliers);
          setAllSuppliers(_allSuppliers);
          setSuppliers(_suppliers);
        } catch (supplierError) {
          console.warn('Could not load suppliers:', supplierError);
          // Continue without suppliers - we can still show cars
          setAllSuppliers([]);
          setSuppliers([]);
        }

        setLoading(false);
        
        if (!user || (user && user.verified)) {
          setVisible(true);
        }
        return;
      } catch (err) {
        console.error('Cars onLoad - error:', err);
        helper.error(err);
        setLoading(false);
        setNoMatch(true);
        return;
      }
    }

    const { pickupLocationId } = state;
    const { dropOffLocationId } = state;
    const { from: _from } = state;
    const { to: _to } = state;

    if (!pickupLocationId || !dropOffLocationId || !_from || !_to) {
      setLoading(false);
      setNoMatch(true);
      return;
    }

    let _pickupLocation;
    let _dropOffLocation;
    try {
      // Try to get pickup location
      try {
        _pickupLocation = await LocationService.getLocation(pickupLocationId);
      } catch (error) {
        console.warn('Failed to fetch pickup location by ID, trying to find by name:', error);
        // If fetching by ID fails, try to find location in our loaded locations by name
        const locations = await LocationService.getLocations('', 0, 100);
        const allLocations = locations?.resultData || locations?.data || [];
        _pickupLocation = allLocations.find((loc: any) => 
          loc._id === pickupLocationId || 
          loc.id === pickupLocationId || 
          loc.name === pickupLocationId
        );
      }

      if (!_pickupLocation) {
        console.warn('Pickup location not found:', pickupLocationId);
        setLoading(false);
        setNoMatch(true);
        return;
      }

      // Try to get drop-off location
      if (dropOffLocationId !== pickupLocationId) {
        try {
          _dropOffLocation = await LocationService.getLocation(dropOffLocationId);
        } catch (error) {
          console.warn('Failed to fetch drop-off location by ID, trying to find by name:', error);
          // If fetching by ID fails, try to find location in our loaded locations by name
          const locations = await LocationService.getLocations('', 0, 100);
          const allLocations = locations?.resultData || locations?.data || [];
          _dropOffLocation = allLocations.find((loc: any) => 
            loc._id === dropOffLocationId || 
            loc.id === dropOffLocationId || 
            loc.name === dropOffLocationId
          );
        }
      } else {
        _dropOffLocation = _pickupLocation;
      }

      if (!_dropOffLocation) {
        console.warn('Drop-off location not found:', dropOffLocationId);
        setLoading(false);
        setNoMatch(true);
        return;
      }

      const payload: bookcarsTypes.GetCarsPayload = {
        pickupLocation: _pickupLocation._id || _pickupLocation.id,
        dropoffLocation: _dropOffLocation._id || _dropOffLocation.id,
        from: _from,
        to: _to,
        carSpecs,
        carType,
        gearbox,
        mileage,
        fuelPolicy,
        deposit,
      };
      const _allSuppliers = await SupplierService.getFrontendSuppliers(payload);
      const _suppliers = bookcarsHelper.flattenSuppliers(_allSuppliers);

      setPickupLocation(_pickupLocation);
      setDropOffLocation(_dropOffLocation);
      setFrom(_from);
      setTo(_to);
      setAllSuppliers(_allSuppliers);
      setSuppliers(_suppliers);
      setLoading(false);
      if (!user || (user && user.verified)) {
        setVisible(true);
      }
    } catch (err) {
      helper.error(err);
    }
  };

  return (
    <Layout onLoad={onLoad} strict={false}>
      <PageHeader
        title={strings.OUR_FLEETS}
        breadcrumb={[strings.HOME, strings.FLEETS]}
      />
      <div className="page-fleets">
        <div className="container">
          <div className="row">
            {pickupLocation && dropOffLocation && from && to && (
              <div className="col-lg-3">
                <CarsSidebar
                  suppliers={allSuppliers}
                  onSuppliersChange={handleSupplierFilterChange}
                  onDepositChange={handleDepositFilterChange}
                  onCarSpecsChange={handleCarSpecsFilterChange}
                  onCarTypeChange={handleCarTypeFilterChange}
                  onCarTransmissionChange={handleGearboxFilterChange}
                  onMileageChange={handleMileageFilterChange}
                  onFuelPolicyChange={handleFuelPolicyFilterChange}
                />
              </div>
            )}
            <div className={pickupLocation && dropOffLocation && from && to ? "col-lg-9" : "col-lg-12"}>
              {loading && (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="mb-4">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <h5 className="text-muted mb-2">Loading Available Vehicles</h5>
                  <p className="text-muted text-center">Please wait while we search for the best vehicles for you...</p>
                  
                  {/* Loading skeleton cards */}
                  <div className="row mt-4 w-100">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="col-lg-4 col-md-6 mb-4">
                        <div className="card" style={{ height: '300px' }}>
                          <div className="card-body p-3">
                            <div className="placeholder-glow">
                              <div className="placeholder bg-secondary mb-3" style={{ height: '150px', borderRadius: '8px' }}></div>
                              <div className="placeholder col-8 mb-2"></div>
                              <div className="placeholder col-6 mb-3"></div>
                              <div className="d-flex justify-content-between">
                                <div className="placeholder col-4"></div>
                                <div className="placeholder col-3"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!loading && noMatch && (
                <div className="alert alert-warning" role="alert">
                  <div className="d-flex flex-column align-items-center text-center py-4">
                    <div className="mb-3">
                      <i className="fa fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#ffc107' }}></i>
                    </div>
                    <h4 className="alert-heading mb-3">{carsStrings.OOPS}</h4>
                    <p className="mb-3">Sorry, no vehicles are available at the moment. Please try adjusting your search criteria or contact us for assistance.</p>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => window.location.reload()}
                      >
                        <i className="fa fa-refresh me-1"></i>
                        Try Again
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => window.location.href = '/contact'}
                      >
                        <i className="fa fa-envelope me-1"></i>
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!loading && visible && (
                <FleetsCollection
                  carSpecs={carSpecs}
                  suppliers={suppliers || []}
                  carType={carType}
                  gearbox={gearbox}
                  mileage={mileage}
                  fuelPolicy={fuelPolicy}
                  deposit={deposit}
                  pickupLocation={pickupLocation?._id}
                  dropOffLocation={dropOffLocation?._id}
                  loading={loading}
                  from={from}
                  to={to}
                  hidePrice={!pickupLocation || !dropOffLocation || !from || !to}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cars;
