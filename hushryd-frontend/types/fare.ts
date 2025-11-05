/**
 * Type definitions for Fare Pricing System
 */

export type FareCalculationType = 'fixed' | 'per_km' | 'per_minute' | 'per_km_plus_time';
export type FareRuleStatus = 'active' | 'inactive' | 'scheduled';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type RuleType = 'holiday' | 'event' | 'weather' | 'demand' | 'promotional';

export interface FarePricing {
  id: string;
  
  // Basic Info
  name: string;
  description?: string;
  calculationType: FareCalculationType;
  
  // Vehicle Type Specific
  vehicleType?: string;
  
  // Base Pricing
  baseFare: number;
  minimumFare: number;
  
  // Distance-based
  pricePerKm?: number;
  freeKm?: number;
  
  // Time-based
  pricePerMinute?: number;
  freeMinutes?: number;
  
  // Booking Fee
  bookingFee: number;
  bookingFeePercentage: number;
  
  // Platform Fee
  platformFee: number;
  platformFeePercentage: number;
  
  // Surge/Dynamic Pricing
  surgeMultiplier: number;
  surgeEnabled: boolean;
  
  // Geographic Constraints
  applicableCities?: string[];
  applicableStates?: string[];
  
  // Time Constraints
  validFromDate?: string;
  validToDate?: string;
  validFromTime?: string;
  validToTime?: string;
  validDaysOfWeek?: DayOfWeek[];
  
  // Status & Priority
  status: FareRuleStatus;
  priority: number;
  
  // Metadata
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface FareSpecialRule {
  id: string;
  
  // Rule Info
  name: string;
  description?: string;
  ruleType: RuleType;
  
  // Pricing Adjustments
  discountPercentage: number;
  discountAmount: number;
  surgeMultiplier: number;
  
  // Conditions
  applicableCities?: string[];
  applicableVehicleTypes?: string[];
  minDistanceKm?: number;
  maxDistanceKm?: number;
  
  // Validity
  validFrom: string;
  validTo: string;
  
  // Status
  status: FareRuleStatus;
  priority: number;
  
  // Usage Limits
  maxUsesPerUser?: number;
  totalMaxUses?: number;
  currentUses: number;
  
  // Promo Code
  promoCode?: string;
  
  // Metadata
  createdBy?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface FareCalculation {
  id: string;
  rideId?: string;
  bookingId?: string;
  
  // Applied Rules
  baseFareRuleId?: string;
  specialRulesApplied?: {
    id: string;
    name: string;
    adjustment: number;
  }[];
  
  // Calculation Breakdown
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  bookingFee: number;
  platformFee: number;
  surgeAmount: number;
  discountAmount: number;
  totalFare: number;
  
  // Trip Details
  distanceKm?: number;
  durationMinutes?: number;
  vehicleType?: string;
  
  // Applied Multipliers
  surgeMultiplier: number;
  
  // Timestamps
  calculatedAt: string;
}

export interface FareCalculationResult {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  bookingFee: number;
  platformFee: number;
  surgeAmount: number;
  discountAmount: number;
  totalFare: number;
  appliedRule?: FarePricing;
  appliedSpecialRules?: FareSpecialRule[];
  breakdown: string[];
}

export interface CalculateFareParams {
  vehicleType: string;
  distanceKm: number;
  durationMinutes: number;
  city?: string;
  state?: string;
  date?: Date;
  promoCode?: string;
}

export interface FareStatistics {
  totalRules: number;
  activeRules: number;
  inactiveRules: number;
  scheduledRules: number;
  byVehicleType: Record<string, number>;
  averageBaseFare: number;
  averageMinimumFare: number;
  averagePricePerKm: number;
  surgeEnabledCount: number;
}

export interface FareFilters {
  status?: FareRuleStatus;
  vehicleType?: string;
  city?: string;
  state?: string;
  searchQuery?: string;
  minPriority?: number;
  maxPriority?: number;
}

export interface CreateFareInput extends Omit<FarePricing, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateFareInput extends Partial<Omit<FarePricing, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface FareValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface BulkFareUpdate {
  id: string;
  data: UpdateFareInput;
}

export interface FareImportResult {
  success: number;
  failed: number;
  errors: string[];
  imported?: FarePricing[];
}

export interface FareExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeInactive?: boolean;
  vehicleTypes?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

// Helper type for form data
export interface FareFormData {
  name: string;
  description: string;
  calculationType: FareCalculationType;
  vehicleType: string;
  baseFare: number;
  minimumFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  bookingFee: number;
  platformFee: number;
  bookingFeePercentage: number;
  platformFeePercentage: number;
  surgeMultiplier: number;
  surgeEnabled: boolean;
  freeKm: number;
  freeMinutes: number;
  status: FareRuleStatus;
  priority: number;
  notes: string;
  applicableCities: string[];
  applicableStates: string[];
  validFromDate: string;
  validToDate: string;
  validFromTime: string;
  validToTime: string;
  validDaysOfWeek: DayOfWeek[];
}

// API Response types
export interface FareApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedFareResponse {
  data: FarePricing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

