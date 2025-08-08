import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { strings } from "../lang/cars";
import { strings as commonStrings } from "../lang/common";
import env from "../config/env.config";

import "../assets/css/cars-sidebar.css";

import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import { StraightenSharp } from "@mui/icons-material";

const categories = [
  { id: 1, label: strings.DIESEL, value: bookcarsTypes.CarType.Diesel },
  { id: 2, label: strings.GASOLINE, value: bookcarsTypes.CarType.Gasoline },
  { id: 3, label: strings.ELECTRIC, value: bookcarsTypes.CarType.Electric },
  { id: 4, label: strings.HYBRID, value: bookcarsTypes.CarType.Hybrid },
  {
    id: 5,
    label: strings.PLUG_IN_HYBRID,
    value: bookcarsTypes.CarType.PlugInHybrid,
  },
];

const transmission = [
  {
    id: 9,
    label: strings.GEARBOX_AUTOMATIC,
    value: bookcarsTypes.GearboxType.Automatic,
  },
  {
    id: 10,
    label: strings.GEARBOX_MANUAL,
    value: bookcarsTypes.GearboxType.Manual,
  },
];
const mileage = [
  { id: 11, label: strings.LIMITED, value: bookcarsTypes.Mileage.Limited },
  { id: 12, label: strings.UNLIMITED, value: bookcarsTypes.Mileage.Unlimited },
];
const fuelPolicy = [
  {
    id: 13,
    label: strings.LIKE_FOR_LIKE,
    value: bookcarsTypes.FuelPolicy.LikeForlike,
  },
  {
    id: 14,
    label: strings.FREE_TANK,
    value: bookcarsTypes.FuelPolicy.FreeTank,
  },
];

interface CarsSidebarProps {
  suppliers: bookcarsTypes.User[];
  onCarSpecsChange: (values: bookcarsTypes.CarSpecs) => void;
  onSuppliersChange: (value: string[]) => void;
  onDepositChange: (value: number) => void;
  onCarTypeChange: (values: bookcarsTypes.CarType[]) => void;
  onCarTransmissionChange: (values: bookcarsTypes.GearboxType[]) => void;
  onMileageChange: (values: bookcarsTypes.Mileage[]) => void;
  onFuelPolicyChange: (values: bookcarsTypes.FuelPolicy[]) => void;
}
const CarsSidebar: React.FC<CarsSidebarProps> = ({
  suppliers: suppliersFromProps,
  onDepositChange,
  onSuppliersChange,
  onCarSpecsChange,
  onCarTypeChange,
  onCarTransmissionChange,
  onMileageChange,
  onFuelPolicyChange,
}) => {
  useEffect(() => {
    setSuppliers(suppliersFromProps);
    // setCheckedSuppliers(bookcarsHelper.flattenSuppliers(suppliersFromProps))
  }, [suppliersFromProps]);

  useEffect(() => {
    if (depositAllRef.current) {
      depositAllRef.current.checked = true;
    }
  }, []);
  const depositValue1Ref = useRef<HTMLInputElement>(null);
  const depositValue2Ref = useRef<HTMLInputElement>(null);
  const depositValue3Ref = useRef<HTMLInputElement>(null);
  const depositAllRef = useRef<HTMLInputElement>(null);

  const { ref, inView } = useInView({
    triggerOnce: true, // Animation occurs only once
    threshold: 0.01, // Trigger animation when 10% of the component is visible
  });

  const allTypes = bookcarsHelper.getAllCarTypes();
  const [suppliers, setSuppliers] = useState<bookcarsTypes.User[]>([]);

  const [typeValues, setTypeValues] = useState(allTypes);
  const [specsValue, setSpecsValue] = useState<bookcarsTypes.CarSpecs>({});
  const [transmissionValues, setTransmissionValues] = useState([
    bookcarsTypes.GearboxType.Automatic,
    bookcarsTypes.GearboxType.Manual,
  ]);
  const [mileageValues, setMileageValues] = useState([
    bookcarsTypes.Mileage.Limited,
    bookcarsTypes.Mileage.Unlimited,
  ]);
  const [fuelPolicyValues, setFuelPolicyValues] = useState([
    bookcarsTypes.FuelPolicy.LikeForlike,
    bookcarsTypes.FuelPolicy.FreeTank,
  ]);
  const [checkedSuppliers, setCheckedSuppliers] = useState<string[]>([]);

  const handleAllDepositChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if ("checked" in e.currentTarget && e.currentTarget.checked) {
      const value = -1;
      if (depositValue1Ref.current) {
        depositValue1Ref.current.checked = false;
      }
      if (depositValue2Ref.current) {
        depositValue2Ref.current.checked = false;
      }
      if (depositValue3Ref.current) {
        depositValue3Ref.current.checked = false;
      }
      if (onDepositChange) {
        onDepositChange(value);
      }
    }
  };

  const handleAllDepositClick = (e: React.MouseEvent<HTMLElement>) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement;
    if (!checkbox.checked) {
      checkbox.checked = !checkbox.checked;
      const event = e;
      event.currentTarget = checkbox;
      handleAllDepositChange(event);
    }
  };

  const handleDepositLessThanValue1Change = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if ("checked" in e.currentTarget && e.currentTarget.checked) {
      const value = env.DEPOSIT_FILTER_VALUE_1;
      if (depositAllRef.current) {
        depositAllRef.current.checked = false;
      }
      if (depositValue2Ref.current) {
        depositValue2Ref.current.checked = false;
      }
      if (depositValue3Ref.current) {
        depositValue3Ref.current.checked = false;
      }
      if (onDepositChange) {
        onDepositChange(value);
      }
    }
  };

  const handleDepositLessThanValue1Click = (
    e: React.MouseEvent<HTMLElement>
  ) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement;
    if (!checkbox.checked) {
      checkbox.checked = !checkbox.checked;
      const event = e;
      event.currentTarget = checkbox;
      handleDepositLessThanValue1Change(event);
    }
  };

  const handleDepositLessThanValue2Change = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if ("checked" in e.currentTarget && e.currentTarget.checked) {
      const value = env.DEPOSIT_FILTER_VALUE_2;
      if (depositAllRef.current) {
        depositAllRef.current.checked = false;
      }
      if (depositValue1Ref.current) {
        depositValue1Ref.current.checked = false;
      }
      if (depositValue3Ref.current) {
        depositValue3Ref.current.checked = false;
      }
      if (onDepositChange) {
        onDepositChange(value);
      }
    }
  };

  const handleDepositLessThanValue2Click = (
    e: React.MouseEvent<HTMLElement>
  ) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement;
    if (!checkbox.checked) {
      checkbox.checked = !checkbox.checked;
      const event = e;
      event.currentTarget = checkbox;
      handleDepositLessThanValue2Change(event);
    }
  };

  const handleDepositLessThanValue3Change = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if ("checked" in e.currentTarget && e.currentTarget.checked) {
      const value = env.DEPOSIT_FILTER_VALUE_3;

      if (depositAllRef.current) {
        depositAllRef.current.checked = false;
      }
      if (depositValue1Ref.current) {
        depositValue1Ref.current.checked = false;
      }
      if (depositValue2Ref.current) {
        depositValue2Ref.current.checked = false;
      }

      if (onDepositChange) {
        onDepositChange(value);
      }
    }
  };

  const handleDepositLessThanValue3Click = (
    e: React.MouseEvent<HTMLElement>
  ) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement;
    if (!checkbox.checked) {
      checkbox.checked = !checkbox.checked;
      const event = e;
      event.currentTarget = checkbox;
      handleDepositLessThanValue3Change(event);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fleets-sidebar"
    >
      {/* Fleets Search Box Start */}
      {/* <div className="fleets-search-box">
        <form id="fleetsForm" action="#" method="POST">
          <div className="form-group">
            <input
              type="text"
              name="search"
              className="form-control"
              id="search"
              placeholder="Search..."
              required
            />
            <button type="submit" className="section-icon-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
      </div> */}
      {/* Fleets Search Box End */}

      <div className="fleets-sidebar-list-box">
        {/* Fleets Sidebar List Start */}
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.SUPPLIERS}</h3>
            <ul>
              {suppliers.map((item) => (
                <li className="form-check" key={item._id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    data-id={item._id}
                    onChange={(e) => {
                      const supplierId = e.currentTarget.getAttribute(
                        "data-id"
                      ) as string;
                      if (e.target.checked) {
                        checkedSuppliers.push(supplierId);
                      } else {
                        const index = checkedSuppliers.indexOf(supplierId);
                        checkedSuppliers.splice(index, 1);
                      }
                      setCheckedSuppliers([...checkedSuppliers]);
                      if (onSuppliersChange) {
                        if (checkedSuppliers.length === 0) {
                          onSuppliersChange(
                            bookcarsHelper.clone(
                              bookcarsHelper.flattenSuppliers(
                                suppliersFromProps
                              )
                            )
                          );
                        } else {
                          onSuppliersChange(
                            bookcarsHelper.clone(checkedSuppliers)
                          );
                        }
                      }
                    }}
                    id={`checkbox${item._id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`checkbox${item._id}`}
                  >
                    {item.fullName}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.CATEGORIES}</h3>
          </div>
          <ul>
            {categories.map((item) => (
              <li className="form-check" key={item.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      typeValues.push(item.value);
                    } else {
                      typeValues.splice(
                        typeValues.findIndex((v) => v === item.value),
                        1
                      );
                    }
                    setTypeValues([...typeValues]);
                    if (onCarTypeChange) {
                      onCarTypeChange(bookcarsHelper.clone(typeValues));
                    }
                  }}
                  id={`checkbox${item.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox${item.id}`}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Fleets Sidebar List End */}

        {/* Fleets Sidebar List Start */}
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.CAR_SPECS}</h3>
          </div>
          <ul>
            <li className="form-check" key={1}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    specsValue.aircon = true;
                  } else {
                    specsValue.aircon = undefined;
                  }
                  setSpecsValue({ ...specsValue });
                  if (onCarSpecsChange) {
                    onCarSpecsChange(bookcarsHelper.clone(specsValue));
                  }
                }}
                id={`checkbox${1.1}`}
              />
              <label className="form-check-label" htmlFor={`checkbox${1}`}>
                {strings.AIRCON}
              </label>
            </li>
            <li className="form-check" key={2}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    specsValue.moreThanFourDoors = true;
                  } else {
                    specsValue.moreThanFourDoors = undefined;
                  }
                  setSpecsValue({ ...specsValue });
                  if (onCarSpecsChange) {
                    onCarSpecsChange(bookcarsHelper.clone(specsValue));
                  }
                }}
                id={`checkbox${2.1}`}
              />
              <label className="form-check-label" htmlFor={`checkbox${2}`}>
                {strings.MORE_DOORS}
              </label>
            </li>
            <li className="form-check" key={3}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    specsValue.moreThanFiveSeats = true;
                  } else {
                    specsValue.moreThanFiveSeats = undefined;
                  }
                  setSpecsValue({ ...specsValue });
                  if (onCarSpecsChange) {
                    onCarSpecsChange(bookcarsHelper.clone(specsValue));
                  }
                }}
                id={`checkbox${3.1}`}
              />
              <label className="form-check-label" htmlFor={`checkbox${3}`}>
                {strings.MORE_SEATS}
              </label>
            </li>
          </ul>
        </div>
        {/* Fleets Sidebar List End */}

        {/* Fleets Sidebar List Start */}
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.TRANSMISSION}</h3>
          </div>
          <ul>
            {transmission.map((item) => (
              <li className="form-check" key={item.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      transmissionValues.push(item.value);
                    } else {
                      transmissionValues.splice(
                        transmissionValues.findIndex((v) => v === item.value),
                        1
                      );
                    }
                    setTransmissionValues([...transmissionValues]);
                    if (onCarTransmissionChange) {
                      onCarTransmissionChange(
                        bookcarsHelper.clone(transmissionValues)
                      );
                    }
                  }}
                  id={`checkbox${item.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox${item.id}`}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Fleets Sidebar List End */}
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.MILEAGE}</h3>
          </div>
          <ul>
            {mileage.map((item) => (
              <li className="form-check" key={item.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      mileageValues.push(item.value);
                    } else {
                      mileageValues.splice(
                        mileageValues.findIndex((v) => v === item.value),
                        1
                      );
                    }
                    setMileageValues([...mileageValues]);
                    if (onMileageChange) {
                      onMileageChange(bookcarsHelper.clone(mileageValues));
                    }
                  }}
                  id={`checkbox${item.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox${item.id}`}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Fleets Sidebar List End */}
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.FUEL_POLICY}</h3>
          </div>
          <ul>
            {fuelPolicy.map((item) => (
              <li className="form-check" key={item.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      fuelPolicyValues.push(item.value);
                    } else {
                      fuelPolicyValues.splice(
                        fuelPolicyValues.findIndex((v) => v === item.value),
                        1
                      );
                    }
                    setFuelPolicyValues([...fuelPolicyValues]);
                    if (onFuelPolicyChange) {
                      onFuelPolicyChange(
                        bookcarsHelper.clone(fuelPolicyValues)
                      );
                    }
                  }}
                  id={`checkbox${item.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox${item.id}`}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="fleets-sidebar-list">
          <div className="fleets-list-title">
            <h3 className="my-2">{strings.DEPOSIT}</h3>
          </div>
          <div className="filter-elements">
            <div className="filter-element">
              <label
                className="radio-container"
                onClick={handleDepositLessThanValue1Click}
              >
                <input
                  ref={depositValue1Ref}
                  type="radio"
                  onChange={handleDepositLessThanValue1Change}
                />
                <span className="custom-radio"></span>
                {strings.LESS_THAN_VALUE_1}
              </label>
            </div>
            <div className="filter-element">
              <label
                className="radio-container"
                onClick={handleDepositLessThanValue2Click}
              >
                <input
                  ref={depositValue2Ref}
                  type="radio"
                  onChange={handleDepositLessThanValue2Change}
                />
                <span className="custom-radio"></span>
                {strings.LESS_THAN_VALUE_2}
              </label>
            </div>
            <div className="filter-element">
              <label
                className="radio-container"
                onClick={handleDepositLessThanValue3Click}
              >
                <input
                  ref={depositValue3Ref}
                  type="radio"
                  onChange={handleDepositLessThanValue3Change}
                />
                <span className="custom-radio"></span>
                {strings.LESS_THAN_VALUE_3}
              </label>
            </div>
          </div>
          <div className="filter-element">
            <label className="radio-container" onClick={handleAllDepositClick}>
              <input
                ref={depositAllRef}
                type="radio"
                onChange={handleAllDepositChange}
              />
              <span className="custom-radio"></span>
              {commonStrings.ALL}
            </label>
          </div>
        </div>
        {/* Fleets Sidebar List End */}
      </div>
    </motion.div>
  );
};

export default CarsSidebar;
