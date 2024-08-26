import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const FilterModal = ({ visible, onClose, onSelect }) => {
  const [selectedContinent, setSelectedContinent] = useState('Tous');
  
  const continents = ['Tous', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'Antarctic'];

  const handleApply = () => {
    onSelect(selectedContinent);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
 <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.mainTitle}>Filtres</Text>

          {/* Continent Filter */}
          <Text style={styles.filterTitle}>Continent</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedContinent}
              onValueChange={(itemValue) => setSelectedContinent(itemValue)}
              style={styles.picker}
            >
              {continents.map((continent) => (
                <Picker.Item key={continent} label={continent} value={continent} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 20,
    },
    modalContent: {
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 20,
    },
    mainTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: Colors.grey,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 10,
      marginBottom: 20,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    applyButton: {
      backgroundColor: Colors.primaryColor,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    applyButtonText: {
      color: Colors.white,
      fontSize: 16,
    },
    closeButton: {
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: Colors.grey,
    },
    closeButtonText: {
      color: Colors.white,
      fontSize: 16,
    },
  });

export default FilterModal;
