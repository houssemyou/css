import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [flightPath, setFlightPath] = useState([]);

  // Algeria center coordinates for initial map view
  const algeriaCenter = {
    latitude: 28.0339,
    longitude: 1.6596,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required for flight navigation.'
        );
        return;
      }

      startLocationTracking();
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const { coords } = newLocation;
          setLocation(coords);
          setSpeed(coords.speed || 0);
          setAltitude(coords.altitude || 0);
          setHeading(coords.heading || 0);

          // Add to flight path for tracking
          if (trackingEnabled) {
            setFlightPath(prev => [
              ...prev.slice(-100), // Keep last 100 points
              {
                latitude: coords.latitude,
                longitude: coords.longitude,
              }
            ]);
          }
        }
      );

      return () => {
        locationSubscription.remove();
      };
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const toggleTracking = () => {
    setTrackingEnabled(!trackingEnabled);
    if (!trackingEnabled) {
      setFlightPath([]);
    }
  };

  const clearFlightPath = () => {
    setFlightPath([]);
  };

  const formatSpeed = (speedMs) => {
    const speedKnots = speedMs * 1.94384;
    return speedKnots.toFixed(0);
  };

  const formatAltitude = (altitudeM) => {
    const altitudeFt = altitudeM * 3.28084;
    return altitudeFt.toFixed(0);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={algeriaCenter}
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        } : algeriaCenter}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        mapType="satellite"
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Position"
            description={`Speed: ${formatSpeed(speed)} kt | Alt: ${formatAltitude(altitude)} ft`}
          >
            <View style={[styles.aircraftMarker, { transform: [{ rotate: `${heading}deg` }] }]}>
              <Ionicons name="airplane" size={24} color="#ff0000" />
            </View>
          </Marker>
        )}

        {flightPath.length > 1 && (
          <Polyline
            coordinates={flightPath}
            strokeColor="#ff0000"
            strokeWidth={3}
            strokePattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Flight Information Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Speed</Text>
            <Text style={styles.infoValue}>{formatSpeed(speed)} kt</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Altitude</Text>
            <Text style={styles.infoValue}>{formatAltitude(altitude)} ft</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Heading</Text>
            <Text style={styles.infoValue}>{heading.toFixed(0)}°</Text>
          </View>
        </View>

        {location && (
          <View style={styles.coordsRow}>
            <Text style={styles.coordsText}>
              {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
            </Text>
          </View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsPanel}>
        <TouchableOpacity
          style={[styles.controlButton, trackingEnabled && styles.activeButton]}
          onPress={toggleTracking}
        >
          <Ionicons 
            name={trackingEnabled ? "radio-button-on" : "radio-button-off"} 
            size={20} 
            color={trackingEnabled ? "#fff" : "#1e3a8a"} 
          />
          <Text style={[styles.buttonText, trackingEnabled && styles.activeButtonText]}>
            Track Flight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={clearFlightPath}
        >
          <Ionicons name="trash-outline" size={20} color="#1e3a8a" />
          <Text style={styles.buttonText}>Clear Path</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  coordsRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  controlsPanel: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeButton: {
    backgroundColor: '#1e3a8a',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#fff',
  },
  aircraftMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});