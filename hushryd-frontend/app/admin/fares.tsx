import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import { useColorScheme } from '../../components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

// Types
type FareCalculationType = 'fixed' | 'per_km' | 'per_minute' | 'per_km_plus_time';
type FareRuleStatus = 'active' | 'inactive' | 'scheduled';

interface FarePricing {
  id: string;
  name: string;
  description?: string;
  calculationType: FareCalculationType;
  vehicleType?: string;
  baseFare: number;
  minimumFare: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  bookingFee: number;
  platformFee: number;
  surgeMultiplier: number;
  surgeEnabled: boolean;
  status: FareRuleStatus;
  priority: number;
  applicableCities?: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockFares: FarePricing[] = [
  {
    id: '1',
    name: 'Standard Sedan Pricing',
    description: 'Default pricing for sedan vehicles',
    calculationType: 'per_km_plus_time',
    vehicleType: 'sedan',
    baseFare: 50,
    minimumFare: 80,
    pricePerKm: 12,
    pricePerMinute: 2,
    bookingFee: 10,
    platformFee: 15,
    surgeMultiplier: 1.0,
    surgeEnabled: false,
    status: 'active',
    priority: 1,
    applicableCities: ['Mumbai', 'Delhi', 'Bangalore'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'SUV Premium Pricing',
    description: 'Premium pricing for SUV vehicles',
    calculationType: 'per_km_plus_time',
    vehicleType: 'suv',
    baseFare: 80,
    minimumFare: 120,
    pricePerKm: 18,
    pricePerMinute: 3,
    bookingFee: 15,
    platformFee: 20,
    surgeMultiplier: 1.0,
    surgeEnabled: false,
    status: 'active',
    priority: 2,
    applicableCities: ['Mumbai', 'Delhi'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Economy Pricing',
    description: 'Budget-friendly pricing',
    calculationType: 'per_km_plus_time',
    vehicleType: 'economy',
    baseFare: 30,
    minimumFare: 50,
    pricePerKm: 8,
    pricePerMinute: 1.5,
    bookingFee: 5,
    platformFee: 10,
    surgeMultiplier: 1.0,
    surgeEnabled: false,
    status: 'active',
    priority: 0,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Luxury Pricing',
    description: 'High-end luxury vehicle pricing',
    calculationType: 'per_km_plus_time',
    vehicleType: 'luxury',
    baseFare: 150,
    minimumFare: 250,
    pricePerKm: 25,
    pricePerMinute: 5,
    bookingFee: 25,
    platformFee: 30,
    surgeMultiplier: 1.0,
    surgeEnabled: true,
    status: 'active',
    priority: 3,
    applicableCities: ['Mumbai'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Weekend Surge Pricing',
    description: 'Weekend surge pricing for all vehicles',
    calculationType: 'per_km_plus_time',
    baseFare: 60,
    minimumFare: 100,
    pricePerKm: 15,
    pricePerMinute: 2.5,
    bookingFee: 12,
    platformFee: 18,
    surgeMultiplier: 1.5,
    surgeEnabled: true,
    status: 'scheduled',
    priority: 5,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
];

const VEHICLE_TYPES = ['All', 'sedan', 'suv', 'van', 'luxury', 'economy', 'bus'];
const CALCULATION_TYPES: FareCalculationType[] = ['fixed', 'per_km', 'per_minute', 'per_km_plus_time'];
const STATUS_OPTIONS: FareRuleStatus[] = ['active', 'inactive', 'scheduled'];

export default function FarePricingManagement() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [fares, setFares] = useState<FarePricing[]>(mockFares);
  const [selectedFare, setSelectedFare] = useState<FarePricing | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVehicleType, setFilterVehicleType] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'all' | FareRuleStatus>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<FarePricing>>({
    name: '',
    description: '',
    calculationType: 'per_km_plus_time',
    vehicleType: '',
    baseFare: 0,
    minimumFare: 0,
    pricePerKm: 0,
    pricePerMinute: 0,
    bookingFee: 0,
    platformFee: 0,
    surgeMultiplier: 1.0,
    surgeEnabled: false,
    status: 'active',
    priority: 0,
  });


  const handleAddNew = () => {
    setFormData({
      name: '',
      description: '',
      calculationType: 'per_km_plus_time',
      vehicleType: '',
      baseFare: 0,
      minimumFare: 0,
      pricePerKm: 0,
      pricePerMinute: 0,
      bookingFee: 0,
      platformFee: 0,
      surgeMultiplier: 1.0,
      surgeEnabled: false,
      status: 'active',
      priority: 0,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (fare: FarePricing) => {
    setFormData(fare);
    setSelectedFare(fare);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (fare: FarePricing) => {
    Alert.alert(
      'Delete Fare Rule',
      `Are you sure you want to delete "${fare.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFares(fares.filter(f => f.id !== fare.id));
            Alert.alert('Success', 'Fare rule deleted successfully');
          },
        },
      ]
    );
  };

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.calculationType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.baseFare! < 0 || formData.minimumFare! < 0) {
      Alert.alert('Error', 'Fares cannot be negative');
      return;
    }

    if (isEditing && selectedFare) {
      // Update existing fare
      setFares(fares.map(f => 
        f.id === selectedFare.id 
          ? { ...f, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : f
      ));
      Alert.alert('Success', 'Fare rule updated successfully');
    } else {
      // Add new fare
      const newFare: FarePricing = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      } as FarePricing;
      setFares([...fares, newFare]);
      Alert.alert('Success', 'Fare rule created successfully');
    }

    setShowModal(false);
    setFormData({});
    setSelectedFare(null);
  };

  const handleToggleStatus = (fare: FarePricing) => {
    const newStatus = fare.status === 'active' ? 'inactive' : 'active';
    setFares(fares.map(f => 
      f.id === fare.id 
        ? { ...f, status: newStatus }
        : f
    ));
    Alert.alert('Success', `Fare rule ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const filteredFares = fares.filter(fare => {
    const matchesSearch = fare.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fare.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicleType = filterVehicleType === 'All' || fare.vehicleType === filterVehicleType;
    const matchesStatus = filterStatus === 'all' || fare.status === filterStatus;
    return matchesSearch && matchesVehicleType && matchesStatus;
  });

  const getStatusColor = (status: FareRuleStatus) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Fare Rule Name',
      width: 200,
      render: (value, row) => (
        <View>
          <Text style={[styles.fareName, { color: colors.text }]}>{value}</Text>
          {row.description && (
            <Text style={[styles.fareDescription, { color: colors.textSecondary }]} numberOfLines={1}>
              {row.description}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'vehicleType',
      label: 'Vehicle Type',
      width: 120,
      render: (value) => (
        <View style={[styles.vehicleTypeBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.vehicleTypeText, { color: colors.primary }]}>
            {value || 'All'}
          </Text>
        </View>
      ),
    },
    {
      key: 'baseFare',
      label: 'Base Fare',
      width: 100,
      render: (value) => (
        <Text style={[styles.priceText, { color: colors.text }]}>
          {CURRENCY_SYMBOL}{value}
        </Text>
      ),
    },
    {
      key: 'pricePerKm',
      label: 'Per KM',
      width: 100,
      render: (value) => (
        <Text style={[styles.priceText, { color: colors.text }]}>
          {value ? `${CURRENCY_SYMBOL}${value}` : '-'}
        </Text>
      ),
    },
    {
      key: 'minimumFare',
      label: 'Min Fare',
      width: 100,
      render: (value) => (
        <Text style={[styles.priceText, { color: colors.text }]}>
          {CURRENCY_SYMBOL}{value}
        </Text>
      ),
    },
    {
      key: 'surgeMultiplier',
      label: 'Surge',
      width: 80,
      render: (value, row) => (
        <View style={styles.surgeContainer}>
          <Text style={[
            styles.surgeText,
            { color: row.surgeEnabled ? '#ef4444' : colors.textSecondary }
          ]}>
            {value}x
          </Text>
          {row.surgeEnabled && <Text style={styles.surgeIcon}>⚡</Text>}
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(value) }]}>
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      width: 80,
      render: (value) => (
        <View style={[styles.priorityBadge, { backgroundColor: colors.lightGray }]}>
          <Text style={[styles.priorityText, { color: colors.text }]}>{value}</Text>
        </View>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 200,
      render: (_, row) => (
        <View style={styles.actionsCell}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleEdit(row)}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: row.status === 'active' ? '#f59e0b20' : '#10b98120' }]}
            onPress={() => handleToggleStatus(row)}
          >
            <Text style={[styles.actionButtonText, { color: row.status === 'active' ? '#f59e0b' : '#10b981' }]}>
              {row.status === 'active' ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef444420' }]}
            onPress={() => handleDelete(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <AdminLayout title="Fare Pricing Management" currentPage="fares">
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Fare Pricing Management</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Manage fare rules and pricing strategies
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddNew}
              >
                <Text style={styles.addButtonText}>+ Add Fare Rule</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <StatCard
                icon="💰"
                label="Total Fare Rules"
                value={fares.length.toString()}
                color="#3b82f6"
              />
              <StatCard
                icon="✅"
                label="Active Rules"
                value={fares.filter(f => f.status === 'active').length.toString()}
                color="#10b981"
              />
              <StatCard
                icon="🚗"
                label="Vehicle Types"
                value={new Set(fares.filter(f => f.vehicleType).map(f => f.vehicleType)).size.toString()}
                color="#8b5cf6"
              />
              <StatCard
                icon="⚡"
                label="Surge Enabled"
                value={fares.filter(f => f.surgeEnabled).length.toString()}
                color="#f59e0b"
              />
            </View>

            {/* Search and Filters */}
            <View style={[styles.searchFiltersCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
              <Text style={[styles.filtersTitle, { color: colors.text }]}>Search & Filter</Text>

              {/* Search Bar */}
              <View style={[styles.searchContainer, { backgroundColor: colors.lightGray, borderColor: colors.border }]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search by name or description..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Filters */}
              <View style={styles.filtersRow}>
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Vehicle Type:</Text>
                  <View style={styles.filterButtons}>
                    {VEHICLE_TYPES.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterButton,
                          { backgroundColor: filterVehicleType === type ? colors.primary : colors.lightGray }
                        ]}
                        onPress={() => setFilterVehicleType(type)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          { color: filterVehicleType === type ? '#FFFFFF' : colors.text }
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Status:</Text>
                  <View style={styles.filterButtons}>
                    {['all', ...STATUS_OPTIONS].map(status => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.filterButton,
                          { backgroundColor: filterStatus === status ? colors.primary : colors.lightGray }
                        ]}
                        onPress={() => setFilterStatus(status as any)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          { color: filterStatus === status ? '#FFFFFF' : colors.text }
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Fares Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={filteredFares}
                onRowPress={(fare) => handleEdit(fare)}
                emptyMessage="No fare rules found"
              />
            </View>
          </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isEditing ? 'Edit Fare Rule' : 'Add New Fare Rule'}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Basic Information */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Rule Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., Standard Sedan Pricing"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Optional description"
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Vehicle Type</Text>
            <View style={styles.pickerContainer}>
              {['All', 'sedan', 'suv', 'van', 'luxury', 'economy', 'bus'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    {
                      backgroundColor: formData.vehicleType === (type === 'All' ? '' : type) ? colors.primary : colors.card,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, vehicleType: type === 'All' ? '' : type })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: formData.vehicleType === (type === 'All' ? '' : type) ? '#FFFFFF' : colors.text }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pricing Details */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing Details</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Base Fare ({CURRENCY_SYMBOL}) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.baseFare?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, baseFare: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Minimum Fare ({CURRENCY_SYMBOL}) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.minimumFare?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, minimumFare: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Price per KM ({CURRENCY_SYMBOL})</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.pricePerKm?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, pricePerKm: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Price per Minute ({CURRENCY_SYMBOL})</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.pricePerMinute?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, pricePerMinute: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Booking Fee ({CURRENCY_SYMBOL})</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.bookingFee?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, bookingFee: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Platform Fee ({CURRENCY_SYMBOL})</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.platformFee?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, platformFee: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Surge Pricing */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Surge Pricing</Text>

            <View style={styles.switchRow}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Enable Surge Pricing</Text>
              <Switch
                value={formData.surgeEnabled}
                onValueChange={(value) => setFormData({ ...formData, surgeEnabled: value })}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={formData.surgeEnabled ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            {formData.surgeEnabled && (
              <View>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Surge Multiplier</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="1.0"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.surgeMultiplier?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, surgeMultiplier: parseFloat(text) || 1.0 })}
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Status and Priority */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Status & Priority</Text>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Status</Text>
            <View style={styles.pickerContainer}>
              {STATUS_OPTIONS.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerOption,
                    {
                      backgroundColor: formData.status === status ? colors.primary : colors.card,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, status })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: formData.status === status ? '#FFFFFF' : colors.text }
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Priority (Higher = More important)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              value={formData.priority?.toString()}
              onChangeText={(text) => setFormData({ ...formData, priority: parseInt(text) || 0 })}
              keyboardType="numeric"
            />

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.lightGray }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {isEditing ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </AdminLayout>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIconText}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    padding: Spacing.medium,
  },
  backIcon: {
    fontSize: FontSizes.large,
  },
  backText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  main: {
    flex: 1,
  },
  mainContent: {
    padding: Spacing.large,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  pageTitle: {
    fontSize: FontSizes.extraLarge * 1.2,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: FontSizes.medium,
    marginTop: 4,
  },
  addButton: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginBottom: Spacing.large,
  },
  statCard: {
    flex: 1,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.small,
  },
  statIconText: {
    fontSize: FontSizes.large,
  },
  statValue: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.tiny,
    textAlign: 'center',
  },
  searchFiltersCard: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginBottom: Spacing.large,
  },
  filtersTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    marginBottom: Spacing.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    marginBottom: Spacing.medium,
  },
  searchIcon: {
    fontSize: FontSizes.medium,
    marginRight: Spacing.small,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.small,
  },
  filtersRow: {
    gap: Spacing.medium,
  },
  filterGroup: {
    marginBottom: Spacing.small,
  },
  filterLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    marginBottom: Spacing.small,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  filterButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
  },
  filterButtonText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tableContainer: {
    marginBottom: Spacing.large,
  },
  fareName: {
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  fareDescription: {
    fontSize: FontSizes.tiny,
    marginTop: 2,
  },
  vehicleTypeBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  vehicleTypeText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  priceText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  surgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  surgeText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  surgeIcon: {
    fontSize: FontSizes.small,
  },
  statusBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'center',
  },
  priorityText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
  actionsCell: {
    flexDirection: 'row',
    gap: Spacing.tiny,
  },
  actionButton: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
  },
  actionButtonText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.large,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: '700',
  },
  modalCloseButton: {
    fontSize: FontSizes.extraLarge,
    fontWeight: '700',
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: Spacing.large,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    marginTop: Spacing.large,
    marginBottom: Spacing.medium,
  },
  inputLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.small,
  },
  input: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    fontSize: FontSizes.small,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.medium,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
    marginBottom: Spacing.small,
  },
  pickerOption: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  pickerOptionText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginTop: Spacing.extraLarge,
    marginBottom: Spacing.extraLarge,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  cancelButton: {},
  saveButton: {},
  modalButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
  },
});

