/**
 * Fare Pricing Service
 * 
 * This service handles all fare pricing operations including:
 * - CRUD operations for fare rules
 * - Fare calculation logic
 * - Special pricing rules
 * - Surge pricing calculations
 */

// Types
export type FareCalculationType = 'fixed' | 'per_km' | 'per_minute' | 'per_km_plus_time';
export type FareRuleStatus = 'active' | 'inactive' | 'scheduled';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface FarePricing {
  id: string;
  name: string;
  description?: string;
  calculationType: FareCalculationType;
  vehicleType?: string;
  baseFare: number;
  minimumFare: number;
  pricePerKm?: number;
  freeKm?: number;
  pricePerMinute?: number;
  freeMinutes?: number;
  bookingFee: number;
  bookingFeePercentage: number;
  platformFee: number;
  platformFeePercentage: number;
  surgeMultiplier: number;
  surgeEnabled: boolean;
  applicableCities?: string[];
  applicableStates?: string[];
  validFromDate?: string;
  validToDate?: string;
  validFromTime?: string;
  validToTime?: string;
  validDaysOfWeek?: DayOfWeek[];
  status: FareRuleStatus;
  priority: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FareSpecialRule {
  id: string;
  name: string;
  description?: string;
  ruleType: 'holiday' | 'event' | 'weather' | 'demand' | 'promotional';
  discountPercentage: number;
  discountAmount: number;
  surgeMultiplier: number;
  applicableCities?: string[];
  applicableVehicleTypes?: string[];
  minDistanceKm?: number;
  maxDistanceKm?: number;
  validFrom: string;
  validTo: string;
  status: FareRuleStatus;
  priority: number;
  maxUsesPerUser?: number;
  totalMaxUses?: number;
  currentUses: number;
  promoCode?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
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

class FarePricingService {
  private apiBaseUrl: string;

  constructor() {
    // In production, this would come from environment variables
    this.apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  /**
   * Get all fare pricing rules
   */
  async getAllFares(filters?: {
    status?: FareRuleStatus;
    vehicleType?: string;
    city?: string;
  }): Promise<FarePricing[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.vehicleType) queryParams.append('vehicleType', filters.vehicleType);
      if (filters?.city) queryParams.append('city', filters.city);

      const response = await fetch(`${this.apiBaseUrl}/fares?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch fares');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fares:', error);
      throw error;
    }
  }

  /**
   * Get a single fare rule by ID
   */
  async getFareById(id: string): Promise<FarePricing> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/${id}`);
      if (!response.ok) throw new Error('Fare not found');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fare:', error);
      throw error;
    }
  }

  /**
   * Create a new fare pricing rule
   */
  async createFare(fareData: Omit<FarePricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<FarePricing> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fareData),
      });

      if (!response.ok) throw new Error('Failed to create fare');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating fare:', error);
      throw error;
    }
  }

  /**
   * Update an existing fare pricing rule
   */
  async updateFare(id: string, fareData: Partial<FarePricing>): Promise<FarePricing> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fareData),
      });

      if (!response.ok) throw new Error('Failed to update fare');
      
      return await response.json();
    } catch (error) {
      console.error('Error updating fare:', error);
      throw error;
    }
  }

  /**
   * Delete a fare pricing rule
   */
  async deleteFare(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete fare');
    } catch (error) {
      console.error('Error deleting fare:', error);
      throw error;
    }
  }

  /**
   * Toggle fare rule status (active/inactive)
   */
  async toggleFareStatus(id: string): Promise<FarePricing> {
    try {
      const fare = await this.getFareById(id);
      const newStatus = fare.status === 'active' ? 'inactive' : 'active';
      
      return await this.updateFare(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling fare status:', error);
      throw error;
    }
  }

  /**
   * Get applicable fare rule for given parameters
   */
  async getApplicableFare(params: {
    vehicleType: string;
    city?: string;
    state?: string;
    date?: Date;
  }): Promise<FarePricing | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/applicable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      console.error('Error getting applicable fare:', error);
      return null;
    }
  }

  /**
   * Calculate fare for a ride
   */
  calculateFare(params: CalculateFareParams, fareRule?: FarePricing): FareCalculationResult {
    if (!fareRule) {
      throw new Error('No fare rule provided for calculation');
    }

    const breakdown: string[] = [];
    let baseFare = fareRule.baseFare;
    let distanceFare = 0;
    let timeFare = 0;
    let bookingFee = fareRule.bookingFee;
    let platformFee = fareRule.platformFee;
    let surgeAmount = 0;
    let discountAmount = 0;

    breakdown.push(`Base Fare: ₹${baseFare.toFixed(2)}`);

    // Calculate distance fare
    if (fareRule.pricePerKm && params.distanceKm > 0) {
      const billableDistance = Math.max(0, params.distanceKm - (fareRule.freeKm || 0));
      distanceFare = billableDistance * fareRule.pricePerKm;
      breakdown.push(`Distance (${billableDistance.toFixed(2)} km × ₹${fareRule.pricePerKm}): ₹${distanceFare.toFixed(2)}`);
    }

    // Calculate time fare
    if (fareRule.pricePerMinute && params.durationMinutes > 0) {
      const billableMinutes = Math.max(0, params.durationMinutes - (fareRule.freeMinutes || 0));
      timeFare = billableMinutes * fareRule.pricePerMinute;
      breakdown.push(`Time (${billableMinutes} min × ₹${fareRule.pricePerMinute}): ₹${timeFare.toFixed(2)}`);
    }

    // Calculate subtotal before fees
    let subtotal = baseFare + distanceFare + timeFare;

    // Apply surge pricing if enabled
    if (fareRule.surgeEnabled && fareRule.surgeMultiplier > 1) {
      surgeAmount = subtotal * (fareRule.surgeMultiplier - 1);
      subtotal += surgeAmount;
      breakdown.push(`Surge (${fareRule.surgeMultiplier}x): ₹${surgeAmount.toFixed(2)}`);
    }

    // Add booking fee
    if (fareRule.bookingFeePercentage > 0) {
      bookingFee += subtotal * (fareRule.bookingFeePercentage / 100);
    }
    if (bookingFee > 0) {
      breakdown.push(`Booking Fee: ₹${bookingFee.toFixed(2)}`);
    }

    // Add platform fee
    if (fareRule.platformFeePercentage > 0) {
      platformFee += subtotal * (fareRule.platformFeePercentage / 100);
    }
    if (platformFee > 0) {
      breakdown.push(`Platform Fee: ₹${platformFee.toFixed(2)}`);
    }

    // Calculate total
    let totalFare = subtotal + bookingFee + platformFee - discountAmount;

    // Apply minimum fare
    if (totalFare < fareRule.minimumFare) {
      const minimumFareAdjustment = fareRule.minimumFare - totalFare;
      breakdown.push(`Minimum Fare Adjustment: ₹${minimumFareAdjustment.toFixed(2)}`);
      totalFare = fareRule.minimumFare;
    }

    breakdown.push(`Total: ₹${totalFare.toFixed(2)}`);

    return {
      baseFare,
      distanceFare,
      timeFare,
      bookingFee,
      platformFee,
      surgeAmount,
      discountAmount,
      totalFare,
      appliedRule: fareRule,
      breakdown,
    };
  }

  /**
   * Calculate fare estimate for a ride (with API call to get applicable rule)
   */
  async calculateFareEstimate(params: CalculateFareParams): Promise<FareCalculationResult> {
    try {
      const applicableFare = await this.getApplicableFare({
        vehicleType: params.vehicleType,
        city: params.city,
        state: params.state,
        date: params.date,
      });

      if (!applicableFare) {
        throw new Error('No applicable fare rule found');
      }

      return this.calculateFare(params, applicableFare);
    } catch (error) {
      console.error('Error calculating fare estimate:', error);
      throw error;
    }
  }

  /**
   * Get fare pricing statistics
   */
  async getFareStatistics(): Promise<{
    totalRules: number;
    activeRules: number;
    inactiveRules: number;
    scheduledRules: number;
    byVehicleType: Record<string, number>;
    averageBaseFare: number;
    averageMinimumFare: number;
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Bulk update fare rules
   */
  async bulkUpdateFares(updates: Array<{ id: string; data: Partial<FarePricing> }>): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) throw new Error('Failed to bulk update fares');
    } catch (error) {
      console.error('Error bulk updating fares:', error);
      throw error;
    }
  }

  /**
   * Duplicate a fare rule
   */
  async duplicateFare(id: string, newName?: string): Promise<FarePricing> {
    try {
      const originalFare = await this.getFareById(id);
      
      const duplicatedFare = {
        ...originalFare,
        name: newName || `${originalFare.name} (Copy)`,
        status: 'inactive' as FareRuleStatus,
        priority: 0,
      };

      // Remove fields that shouldn't be copied
      const { id: _, createdAt, updatedAt, ...fareData } = duplicatedFare;

      return await this.createFare(fareData);
    } catch (error) {
      console.error('Error duplicating fare:', error);
      throw error;
    }
  }

  /**
   * Validate fare rule before saving
   */
  validateFareRule(fare: Partial<FarePricing>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!fare.name || fare.name.trim().length === 0) {
      errors.push('Fare name is required');
    }

    if (!fare.calculationType) {
      errors.push('Calculation type is required');
    }

    if (fare.baseFare !== undefined && fare.baseFare < 0) {
      errors.push('Base fare cannot be negative');
    }

    if (fare.minimumFare !== undefined && fare.minimumFare < 0) {
      errors.push('Minimum fare cannot be negative');
    }

    if (fare.pricePerKm !== undefined && fare.pricePerKm < 0) {
      errors.push('Price per km cannot be negative');
    }

    if (fare.pricePerMinute !== undefined && fare.pricePerMinute < 0) {
      errors.push('Price per minute cannot be negative');
    }

    if (fare.surgeMultiplier !== undefined && fare.surgeMultiplier <= 0) {
      errors.push('Surge multiplier must be greater than 0');
    }

    if (fare.priority !== undefined && fare.priority < 0) {
      errors.push('Priority cannot be negative');
    }

    if (fare.validFromDate && fare.validToDate) {
      const fromDate = new Date(fare.validFromDate);
      const toDate = new Date(fare.validToDate);
      if (fromDate > toDate) {
        errors.push('Valid from date must be before valid to date');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get fare history for analytics
   */
  async getFareHistory(fareId: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/${fareId}/history?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch fare history');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fare history:', error);
      throw error;
    }
  }

  /**
   * Export fares to CSV
   */
  async exportFaresToCSV(): Promise<string> {
    try {
      const fares = await this.getAllFares();
      
      const headers = [
        'ID', 'Name', 'Vehicle Type', 'Base Fare', 'Minimum Fare',
        'Price/KM', 'Price/Min', 'Booking Fee', 'Platform Fee',
        'Surge Multiplier', 'Status', 'Priority', 'Created At'
      ].join(',');

      const rows = fares.map(fare => [
        fare.id,
        `"${fare.name}"`,
        fare.vehicleType || 'All',
        fare.baseFare,
        fare.minimumFare,
        fare.pricePerKm || 0,
        fare.pricePerMinute || 0,
        fare.bookingFee,
        fare.platformFee,
        fare.surgeMultiplier,
        fare.status,
        fare.priority,
        fare.createdAt
      ].join(','));

      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Error exporting fares:', error);
      throw error;
    }
  }

  /**
   * Import fares from CSV
   */
  async importFaresFromCSV(csvData: string): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fares/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvData,
      });

      if (!response.ok) throw new Error('Failed to import fares');
      
      return await response.json();
    } catch (error) {
      console.error('Error importing fares:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const farePricingService = new FarePricingService();

// Export helper functions
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
};

export const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const isTimeInRange = (time: Date, startTime?: string, endTime?: string): boolean => {
  if (!startTime || !endTime) return true;
  
  const timeStr = time.toTimeString().split(' ')[0];
  return timeStr >= startTime && timeStr <= endTime;
};

export default farePricingService;

