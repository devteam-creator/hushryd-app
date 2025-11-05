// SOS Emergency System Types

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  rideId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  status: 'active' | 'resolved' | 'false_alarm';
  emergencyType: 'medical' | 'safety' | 'vehicle' | 'other';
  description?: string;
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SOSContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: 'family' | 'friend' | 'emergency_contact' | 'other';
  isPrimary: boolean;
}

export interface SOSSettings {
  userId: string;
  autoShareLocation: boolean;
  shareWithContacts: boolean;
  emergencyContacts: SOSContact[];
  panicButtonEnabled: boolean;
  voiceActivationEnabled: boolean;
}

export interface SOSResponse {
  alertId: string;
  responderId: string;
  responderName: string;
  responseTime: number; // in seconds
  status: 'dispatched' | 'on_route' | 'arrived' | 'resolved';
  estimatedArrival?: number; // in minutes
  notes?: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'ambulance' | 'fire' | 'roadside' | 'security';
  area: string;
  isActive: boolean;
}
