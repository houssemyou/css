import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VFRScreen() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const openURL = (url) => {
    Linking.openURL(url);
  };

  const airports = [
    {
      name: 'Houari Boumediene Airport',
      icao: 'DAAG',
      iata: 'ALG',
      city: 'Algiers',
      coordinates: '36.6910°N, 3.2154°E',
      elevation: '82 ft',
      runways: '05/23 (3500m), 09/27 (3500m)',
    },
    {
      name: 'Ahmed Ben Bella Airport',
      icao: 'DAOO',
      iata: 'ORN',
      city: 'Oran',
      coordinates: '35.6239°N, 0.6211°W',
      elevation: '295 ft',
      runways: '06/24 (3000m), 13/31 (3000m)',
    },
    {
      name: 'Mohamed Boudiaf Airport',
      icao: 'DABC',
      iata: 'CZL',
      city: 'Constantine',
      coordinates: '36.2760°N, 6.6204°E',
      elevation: '2265 ft',
      runways: '05/23 (3200m)',
    },
    {
      name: 'Rabah Bitat Airport',
      icao: 'DAAS',
      iata: 'AAE',
      city: 'Annaba',
      coordinates: '36.8222°N, 7.8097°E',
      elevation: '16 ft',
      runways: '01/19 (3000m)',
    },
  ];

  const frequencies = [
    { name: 'Emergency', freq: '121.500 MHz', description: 'International emergency frequency' },
    { name: 'Algiers Control', freq: '119.100 MHz', description: 'Area control center' },
    { name: 'Algiers Approach', freq: '118.100 MHz', description: 'Terminal approach control' },
    { name: 'Algiers Tower', freq: '118.700 MHz', description: 'Airport control tower' },
    { name: 'Oran Control', freq: '120.300 MHz', description: 'Area control center' },
    { name: 'Constantine Tower', freq: '118.300 MHz', description: 'Airport control tower' },
  ];

  const vfrRules = [
    {
      title: 'Minimum Altitudes',
      content: [
        '• Over cities/towns: 1000 ft above highest obstacle within 2000 ft',
        '• Over other areas: 500 ft above ground level',
        '• Over water: 500 ft above water surface',
        '• Minimum safe altitude: Always maintain altitude for emergency landing',
      ],
    },
    {
      title: 'Visibility Requirements',
      content: [
        '• Below 3000 ft AMSL: 5 km flight visibility',
        '• At or above 3000 ft AMSL: 8 km flight visibility',
        '• Clear of clouds and in sight of surface',
        '• Special VFR: 1.5 km visibility, clear of clouds',
      ],
    },
    {
      title: 'Airspace Classes',
      content: [
        '• Class A: IFR only, above FL195',
        '• Class C: Controlled airspace around major airports',
        '• Class D: Controlled airspace around airports',
        '• Class G: Uncontrolled airspace, VFR allowed',
      ],
    },
    {
      title: 'Flight Planning',
      content: [
        '• File flight plan for flights crossing international borders',
        '• VFR flight plan recommended for search and rescue',
        '• Close flight plan upon arrival',
        '• Carry current charts and approach plates',
      ],
    },
  ];

  const emergencyInfo = [
    {
      title: 'Emergency Frequencies',
      content: [
        '• 121.500 MHz - International emergency',
        '• 243.000 MHz - Military emergency',
        '• Contact nearest ATC facility immediately',
      ],
    },
    {
      title: 'Emergency Procedures',
      content: [
        '• Squawk 7700 for general emergency',
        '• Squawk 7600 for radio failure',
        '• Squawk 7500 for hijacking',
        '• Maintain VMC if possible',
      ],
    },
    {
      title: 'Search and Rescue',
      content: [
        '• Algeria SAR coordination: +213 21 54 15 15',
        '• File flight plan for overwater flights',
        '• Carry emergency locator transmitter (ELT)',
        '• Know your position at all times',
      ],
    },
  ];

  const renderSection = (title, items, iconName) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(title)}
      >
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={iconName} size={24} color="#1e3a8a" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={expandedSection === title ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {expandedSection === title && (
        <View style={styles.sectionContent}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {typeof item === 'string' ? (
                <Text style={styles.itemText}>{item}</Text>
              ) : item.freq ? (
                <View style={styles.frequencyItem}>
                  <View style={styles.frequencyHeader}>
                    <Text style={styles.frequencyName}>{item.name}</Text>
                    <Text style={styles.frequencyValue}>{item.freq}</Text>
                  </View>
                  <Text style={styles.frequencyDescription}>{item.description}</Text>
                </View>
              ) : item.icao ? (
                <View style={styles.airportItem}>
                  <View style={styles.airportHeader}>
                    <Text style={styles.airportName}>{item.name}</Text>
                    <Text style={styles.airportCode}>{item.icao}/{item.iata}</Text>
                  </View>
                  <Text style={styles.airportCity}>{item.city}</Text>
                  <Text style={styles.airportDetails}>Coordinates: {item.coordinates}</Text>
                  <Text style={styles.airportDetails}>Elevation: {item.elevation}</Text>
                  <Text style={styles.airportDetails}>Runways: {item.runways}</Text>
                </View>
              ) : item.title ? (
                <View style={styles.ruleItem}>
                  <Text style={styles.ruleTitle}>{item.title}</Text>
                  {item.content.map((rule, ruleIndex) => (
                    <Text key={ruleIndex} style={styles.ruleText}>{rule}</Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Algeria VFR References</Text>
        <Text style={styles.headerSubtitle}>Essential information for VFR flight in Algeria</Text>
      </View>

      {renderSection('Major Airports', airports, 'airplane')}
      {renderSection('Radio Frequencies', frequencies, 'radio')}
      {renderSection('VFR Rules & Procedures', vfrRules, 'document-text')}
      {renderSection('Emergency Information', emergencyInfo, 'warning')}

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('Weather Information')}
        >
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="cloud" size={24} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Weather Information</Text>
          </View>
          <Ionicons
            name={expandedSection === 'Weather Information' ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {expandedSection === 'Weather Information' && (
          <View style={styles.sectionContent}>
            <View style={styles.weatherLinks}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openURL('https://www.windy.com')}
              >
                <Ionicons name="link" size={16} color="#1e3a8a" />
                <Text style={styles.linkText}>Windy.com - Weather Maps</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openURL('https://www.meteoblue.com')}
              >
                <Ionicons name="link" size={16} color="#1e3a8a" />
                <Text style={styles.linkText}>MeteoBlue - Weather Forecast</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTitle}>Important Weather Considerations:</Text>
              <Text style={styles.weatherText}>• Check METAR/TAF for departure and destination</Text>
              <Text style={styles.weatherText}>• Monitor winds aloft forecasts</Text>
              <Text style={styles.weatherText}>• Be aware of desert weather patterns</Text>
              <Text style={styles.weatherText}>• Sandstorms can reduce visibility rapidly</Text>
              <Text style={styles.weatherText}>• Mediterranean coastal weather variations</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.disclaimerText}>
            This information is for reference only. Always consult official aeronautical publications and current NOTAMs before flight.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  frequencyItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#1e3a8a',
  },
  frequencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  frequencyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  frequencyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    fontFamily: 'monospace',
  },
  frequencyDescription: {
    fontSize: 12,
    color: '#666',
  },
  airportItem: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0ea5e9',
  },
  airportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  airportName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
    flex: 1,
  },
  airportCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0ea5e9',
    fontFamily: 'monospace',
  },
  airportCity: {
    fontSize: 12,
    color: '#0c4a6e',
    marginBottom: 4,
  },
  airportDetails: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  ruleItem: {
    backgroundColor: '#fefce8',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#eab308',
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#713f12',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 12,
    color: '#713f12',
    lineHeight: 18,
    marginBottom: 4,
  },
  weatherLinks: {
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  linkText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginLeft: 8,
  },
  weatherInfo: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 6,
  },
  weatherTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 12,
    color: '#0c4a6e',
    lineHeight: 18,
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    marginTop: 16,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});