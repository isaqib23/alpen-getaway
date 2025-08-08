import * as bookcarsTypes from "../types/bookcars-types";

// ===== USER TRANSFORMERS =====

/**
 * Transform sign up data from legacy format to new API format
 */
export const transformSignUpData = (legacyData: bookcarsTypes.SignUpPayload): any => {
  return {
    firstName: legacyData.firstName,
    lastName: legacyData.lastName,
    email: legacyData.email,
    password: legacyData.password,
    phone: legacyData.phone || '',
    birthDate: legacyData.birthDate,
    language: legacyData.language || 'en',
    // Map legacy fields to new server fields
    role: 'customer', // Default role for frontend registrations
    verified: false,
    blacklisted: false,
  };
};

/**
 * Transform sign in data from legacy format to new API format
 */
export const transformSignInData = (legacyData: bookcarsTypes.SignInPayload): any => {
  return {
    email: legacyData.email,
    password: legacyData.password,
    stayConnected: legacyData.stayConnected || false,
  };
};

/**
 * Transform server user response to legacy format for UI compatibility
 */
export const transformUserResponse = (serverUser: any): bookcarsTypes.User => {
  return {
    id: serverUser.id || serverUser._id,
    _id: serverUser.id,
    email: serverUser.email,
    firstName: serverUser.firstName,
    lastName: serverUser.lastName,
    phone: serverUser.phone,
    birthDate: serverUser.birthDate,
    verified: serverUser.verified,
    language: serverUser.language || 'en',
    enableEmailNotifications: serverUser.enableEmailNotifications !== false,
    avatar: serverUser.avatar || '',
    bio: serverUser.bio || '',
    location: serverUser.location || '',
    type: serverUser.role || 'user',
    blacklisted: serverUser.blacklisted || false,
  };
};

// ===== BOOKING TRANSFORMERS =====

/**
 * Transform checkout data from legacy format to new API format
 */
export const transformCheckoutData = (legacyData: bookcarsTypes.CheckoutPayload): any => {
  return {
    carId: legacyData.car,
    pickupDateTime: legacyData.from,
    dropoffDateTime: legacyData.to,
    pickupLocationId: legacyData.pickupLocation,
    dropoffLocationId: legacyData.dropoffLocation,
    passengerName: `${legacyData.firstName} ${legacyData.lastName}`,
    passengerEmail: legacyData.email,
    passengerPhone: legacyData.phone,
    passengerBirthDate: legacyData.birthDate,
    flightNumber: legacyData.flightNumber || '',
    specialRequirements: legacyData.comment || '',
    paymentMethod: legacyData.payLater ? 'cash' : 'online',
    additionalDriver: legacyData.additionalDriver || false,
    fullInsurance: legacyData.fullInsurance || false,
    theftProtection: legacyData.theftProtection || false,
    collisionDamageWaiver: legacyData.collisionDamageWaiver || false,
    amendments: legacyData.amendments || false,
    cancellation: legacyData.cancellation || false,
    customerId: legacyData.user || null,
  };
};

/**
 * Transform server booking response to legacy format for UI compatibility
 */
export const transformBookingResponse = (serverBooking: any): bookcarsTypes.Booking => {
  // @ts-ignore - Legacy type compatibility
  return {
    _id: serverBooking.id,
    car: serverBooking.carId,
    pickupLocation: serverBooking.pickupLocationId,
    dropoffLocation: serverBooking.dropoffLocationId,
    from: serverBooking.pickupDateTime,
    to: serverBooking.dropoffDateTime,
    status: serverBooking.status,
    cancellation: serverBooking.cancellation,
    amendments: serverBooking.amendments,
    theftProtection: serverBooking.theftProtection,
    collisionDamageWaiver: serverBooking.collisionDamageWaiver,
    fullInsurance: serverBooking.fullInsurance,
    additionalDriver: serverBooking.additionalDriver,
    price: serverBooking.totalAmount,
    email: serverBooking.passengerEmail,
    phone: serverBooking.passengerPhone,
    fullName: serverBooking.passengerName,
    birthDate: serverBooking.passengerBirthDate,
    payLater: serverBooking.paymentMethod === 'cash',
  };
};

// ===== CAR TRANSFORMERS =====

/**
 * Transform get cars payload from legacy format to new API format
 */
export const transformGetCarsPayload = (legacyData: bookcarsTypes.GetCarsPayload): any => {
  return {
    pickupLocationId: legacyData.pickupLocation,
    dropoffLocationId: legacyData.dropoffLocation,
    pickupDateTime: legacyData.from,
    dropoffDateTime: legacyData.to,
    carSpecs: {
      aircon: legacyData.aircon,
      moreThanFourDoors: legacyData.moreThanFourDoors,
      moreThanFiveSeats: legacyData.moreThanFiveSeats,
    },
    carType: legacyData.carType,
    gearbox: legacyData.gearbox,
    mileage: legacyData.mileage,
    fuelPolicy: legacyData.fuelPolicy,
    deposit: legacyData.deposit,
  };
};

/**
 * Transform server car response to legacy format for UI compatibility
 */
export const transformCarResponse = (serverCar: any): bookcarsTypes.Car => {
  // @ts-ignore - Legacy type compatibility
  return {
    _id: serverCar.id,
    id: serverCar.id,
    name: serverCar.name || `${serverCar.make || ''} ${serverCar.model || ''}`.trim() || 'Car',
    image: serverCar.image || (serverCar.images && serverCar.images.length > 0 ? serverCar.images[0].url : ''),
    price: serverCar.price || serverCar.pricePerDay || 100, // Default price for display
    available: serverCar.available !== false,
    type: serverCar.type || serverCar.category?.name || 'Economy',
    gearbox: serverCar.gearbox || 'automatic',
    aircon: serverCar.aircon || serverCar.hasAC || false,
    doors: serverCar.doors || 4,
    seats: serverCar.seats || 5,
    seat: serverCar.seats || 5, // Legacy alias
    fuelPolicy: serverCar.fuelPolicy || 'likeForlike',
    mileage: serverCar.mileage || 0,
    cancellation: serverCar.cancellation || 0,
    amendments: serverCar.amendments || 0,
    theftProtection: serverCar.theftProtection || 0,
    collisionDamageWaiver: serverCar.collisionDamageWaiver || 0,
    fullInsurance: serverCar.fullInsurance || 0,
    additionalDriver: serverCar.additionalDriver || 0,
    minimumAge: serverCar.minimumAge || 21,
    supplier: serverCar.company || { id: '', name: '', fullName: '', type: 'company', approved: true },
    rating: serverCar.rating || 4.5,
    extra: serverCar.extra || 0,
    // Additional fields for the new API format
    make: serverCar.make || '',
    model: serverCar.model || '',
    year: serverCar.year || new Date().getFullYear(),
    color: serverCar.color || '',
    hasWifi: serverCar.hasWifi || false,
    hasGPS: serverCar.hasGPS || false,
    category: serverCar.category || { id: '', name: 'Economy' },
    features: serverCar.features,
    images: serverCar.images || [],
  };
};

// ===== RESPONSE TRANSFORMERS =====

/**
 * Transform server paginated response to legacy format
 */
export const transformPaginatedResponse = <T>(
  serverResponse: any,
  itemTransformer: (item: any) => T
): bookcarsTypes.Result<T> => {
  // Handle the new API response structure with pagination field
  const pagination = serverResponse.pagination || {};
  const total = pagination.total || serverResponse.total || 0;
  const limit = pagination.limit || serverResponse.limit || 10;
  const page = pagination.page || serverResponse.page || 1;
  
  // @ts-ignore - Legacy type compatibility
  return {
    pageInfo: {
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      pageNumber: page,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    resultData: (serverResponse.data || serverResponse.items || []).map(itemTransformer),
  };
};

/**
 * Transform validation error response to legacy format
 */
export const transformValidationError = (serverError: any): any => {
  if (serverError.response?.data?.message) {
    return {
      message: serverError.response.data.message,
      status: serverError.response.status,
    };
  }
  return serverError;
};

// ===== LOCATION TRANSFORMERS =====

/**
 * Transform server location response to legacy format
 */
export const transformLocationResponse = (serverLocation: any): any => {
  return {
    _id: serverLocation._id || serverLocation.id,
    id: serverLocation.id || serverLocation._id,
    name: serverLocation.name,
    latitude: serverLocation.latitude,
    longitude: serverLocation.longitude,
    country: serverLocation.country,
    type: serverLocation.type,
    values: serverLocation.values || [serverLocation.name],
  };
};

// ===== UTILITY FUNCTIONS =====

/**
 * Extract JWT token from server auth response
 */
export const extractAuthToken = (serverResponse: any): { token: string; user: any } => {
  return {
    token: serverResponse.access_token || serverResponse.token,
    user: transformUserResponse(serverResponse.user || serverResponse.data),
  };
};

/**
 * Transform error response to match legacy API expectations
 */
export const transformErrorResponse = (error: any): any => {
  // If it's already in the expected format, return as is
  if (error.response?.status && error.response?.data) {
    return error;
  }
  
  // Transform to expected format
  return {
    response: {
      status: error.status || 500,
      data: {
        message: error.message || 'An error occurred',
        ...(error.data || {}),
      },
    },
  };
};

// ===== SUPPLIER TRANSFORMERS =====

/**
 * Transform server supplier/company response to legacy format
 */
export const transformSupplierResponse = (serverSupplier: any): any => {
  return {
    _id: serverSupplier.id,
    fullName: serverSupplier.name,
    avatar: serverSupplier.logo || '',
    verified: serverSupplier.verified || false,
    payLater: serverSupplier.payLater || false,
    // Map other fields as needed
  };
};

// ===== NOTIFICATION TRANSFORMERS =====

/**
 * Transform server notification response to legacy format
 */
export const transformNotificationResponse = (serverNotification: any): any => {
  return {
    _id: serverNotification.id,
    user: serverNotification.userId,
    message: serverNotification.message,
    booking: serverNotification.bookingId,
    isRead: serverNotification.isRead || false,
    createdAt: serverNotification.createdAt,
  };
};

// ===== CMS TRANSFORMERS =====

/**
 * Transform CMS page response to expected format
 */
export const transformCMSPageResponse = (serverPage: any): any => {
  return {
    _id: serverPage.id,
    title: serverPage.title,
    content: serverPage.content,
    slug: serverPage.slug,
    status: serverPage.status,
    createdAt: serverPage.createdAt,
    updatedAt: serverPage.updatedAt,
  };
};

// ===== REVIEW TRANSFORMERS =====

/**
 * Transform review submission data to server format
 */
export const transformReviewSubmissionData = (reviewData: any): any => {
  return {
    bookingId: reviewData.bookingId,
    carId: reviewData.carId,
    customerId: reviewData.customerId,
    customerName: reviewData.customerName,
    customerEmail: reviewData.customerEmail,
    rating: reviewData.rating,
    comment: reviewData.comment,
    status: 'pending', // Default status for new reviews
  };
};

/**
 * Transform server review response to legacy format
 */
export const transformReviewResponse = (serverReview: any): any => {
  return {
    _id: serverReview.id,
    booking: serverReview.bookingId,
    car: serverReview.carId,
    user: serverReview.customerId,
    rating: serverReview.rating,
    comment: serverReview.comment,
    customerName: serverReview.customerName,
    status: serverReview.status,
    createdAt: serverReview.createdAt,
  };
};

// ===== COUPON TRANSFORMERS =====

/**
 * Transform coupon validation response
 */
export const transformCouponResponse = (serverCoupon: any): any => {
  return {
    _id: serverCoupon.id,
    code: serverCoupon.code,
    discount: serverCoupon.discount,
    discountType: serverCoupon.discountType, // 'percentage' or 'fixed'
    validFrom: serverCoupon.validFrom,
    validUntil: serverCoupon.validUntil,
    usageLimit: serverCoupon.usageLimit,
    usageCount: serverCoupon.usageCount,
    isValid: serverCoupon.isValid || false,
  };
};

// ===== GENERIC HELPERS =====

/**
 * Transform date strings to Date objects
 */
export const transformDates = (obj: any, dateFields: string[]): any => {
  const transformed = { ...obj };
  
  dateFields.forEach(field => {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field]);
    }
  });
  
  return transformed;
};

/**
 * Transform nested objects recursively
 */
export const transformNested = (
  obj: any, 
  transformMap: Record<string, (item: any) => any>
): any => {
  const transformed = { ...obj };
  
  Object.keys(transformMap).forEach(key => {
    if (transformed[key]) {
      if (Array.isArray(transformed[key])) {
        transformed[key] = transformed[key].map(transformMap[key]);
      } else {
        transformed[key] = transformMap[key](transformed[key]);
      }
    }
  });
  
  return transformed;
};

/**
 * Create query parameters from filters
 */
export const createQueryParams = (filters: any): string => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  return params.toString();
};

/**
 * Safe JSON parse with fallback
 */
export const safeJSONParse = (jsonString: string, fallback: any = null): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return fallback;
  }
};

/**
 * Clean undefined/null values from object
 */
export const cleanObject = (obj: any): any => {
  const cleaned: any = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = cleanObject(value);
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};