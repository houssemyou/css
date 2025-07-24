import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WAYPOINTS_STORAGE_KEY = '@algeria_vfr_waypoints';

export default function WaypointsScreen() {
  const [waypoints, setWaypoints] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWaypoint, setEditingWaypoint] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadWaypoints();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const loadWaypoints = async () => {
    try {
      const stored = await AsyncStorage.getItem(WAYPOINTS_STORAGE_KEY);
      if (stored) {
        setWaypoints(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading waypoints:', error);
    }
  };

  const saveWaypoints = async (newWaypoints) => {
    try {
      await AsyncStorage.setItem(WAYPOINTS_STORAGE_KEY, JSON.stringify(newWaypoints));
      setWaypoints(newWaypoints);
    } catch (error) {
      console.error('Error saving waypoints:', error);
    }
  };

  const openModal = (waypoint = null) => {
    if (waypoint) {
      setEditingWaypoint(waypoint);
      setName(waypoint.name);
      setLatitude(waypoint.latitude.toString());
      setLongitude(waypoint.longitude.toString());
      setAltitude(waypoint.altitude?.toString() || '');
      setNotes(waypoint.notes || '');
    } else {
      setEditingWaypoint(null);
      setName('');
      setLatitude(currentLocation ? currentLocation.latitude.toFixed(6) : '');
      setLongitude(currentLocation ? currentLocation.longitude.toFixed(6) : '');
      setAltitude('');
      setNotes('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingWaypoint(null);
    setName('');
    setLatitude('');
    setLongitude('');
    setAltitude('');
    setNotes('');
  };

  const saveWaypoint = () => {
    if (!name.trim() || !latitude.trim() || !longitude.trim()) {
      Alert.alert('Error', 'Name, latitude, and longitude are required.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const alt = altitude.trim() ? parseFloat(altitude) : null;

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Please enter valid coordinates.');
      return;
    }

    const waypoint = {
      id: editingWaypoint ? editingWaypoint.id : Date.now().toString(),
      name: name.trim(),
      latitude: lat,
      longitude: lng,
      altitude: alt,
      notes: notes.trim(),
      createdAt: editingWaypoint ? editingWaypoint.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newWaypoints;
    if (editingWaypoint) {
      newWaypoints = waypoints.map(wp => wp.id === editingWaypoint.id ? waypoint : wp);
    } else {
      newWaypoints = [...waypoints, waypoint];
    }

    saveWaypoints(newWaypoints);
    closeModal();
  };

  const deleteWaypoint = (waypoint) => {
    Alert.alert(
      'Delete Waypoint',
      `Are you sure you want to delete "${waypoint.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newWaypoints = waypoints.filter(wp => wp.id !== waypoint.id);
            saveWaypoints(newWaypoints);
          },
        },
      ]
    );
  };

  const calculateDistance = (waypoint) => {
    if (!currentLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (waypoint.latitude - currentLocation.latitude) * Math.PI / 180;
    const dLon = (waypoint.longitude - currentLocation.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(currentLocation.latitude * Math.PI / 180) * 
      Math.cos(waypoint.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  const calculateBearing = (waypoint) => {
    if (!currentLocation) return null;
    
    const dLon = (waypoint.longitude - currentLocation.longitude) * Math.PI / 180;
    const lat1 = currentLocation.latitude * Math.PI / 180;
    const lat2 = waypoint.latitude * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    return `${bearing.toFixed(0)}°`;
  };

  const renderWaypoint = ({ item }) => {
    const distance = calculateDistance(item);
    const bearing = calculateBearing(item);

    return (
      <View style={styles.waypointCard}>
        <View style={styles.waypointHeader}>
          <View style={styles.waypointInfo}>
            <Text style={styles.waypointName}>{item.name}</Text>
            <Text style={styles.waypointCoords}>
              {item.latitude.toFixed(6)}°, {item.longitude.toFixed(6)}°
            </Text>
            {item.altitude && (
              <Text style={styles.waypointAltitude}>
                Altitude: {item.altitude} ft
              </Text>
            )}
          </View>
          
          <View style={styles.waypointActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openModal(item)}
            >
              <Ionicons name="pencil" size={20} color="#1e3a8a" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteWaypoint(item)}
            >
              <Ionicons name="trash" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {(distance || bearing) && (
          <View style={styles.navigationInfo}>
            {distance && (
              <View style={styles.navItem}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.navText}>{distance}</Text>
              </View>
            )}
            {bearing && (
              <View style={styles.navItem}>
                <Ionicons name="compass" size={16} color="#666" />
                <Text style={styles.navText}>{bearing}</Text>
              </View>
            )}
          </View>
        )}

        {item.notes && (
          <Text style={styles.waypointNotes}>{item.notes}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Waypoints ({waypoints.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={waypoints}
        renderItem={renderWaypoint}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No waypoints yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first waypoint</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingWaypoint ? 'Edit Waypoint' : 'Add Waypoint'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Waypoint name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Latitude *</Text>
                <TextInput
                  style={styles.input}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="36.123456"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Longitude *</Text>
                <TextInput
                  style={styles.input}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="3.123456"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Altitude (ft)</Text>
                <TextInput
                  style={styles.input}
                  value={altitude}
                  onChangeText={setAltitude}
                  placeholder="1000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Additional notes..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveWaypoint}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  addButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  waypointCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  waypointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  waypointCoords: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  waypointAltitude: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  waypointActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  navigationInfo: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  waypointNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#1e3a8a',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});