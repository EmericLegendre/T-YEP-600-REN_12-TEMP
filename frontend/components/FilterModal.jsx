import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const FilterModal = ({ visible, onClose, onSelect }) => {
  const [selectedContinent, setSelectedContinent] = useState('Tous');
  const [selectedLanguage, setSelectedLanguage] = useState('Tous');
  
  const continents = ['Tous', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'Antarctic'];
  const languages = ['Tous', 'English', 'French']; // Replace with your predefined languages

  const handleApply = () => {
    onSelect({ continent: selectedContinent, language: selectedLanguage });
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

          <Text style={styles.filterTitle}>Langue</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
              style={styles.picker}
            >
              {languages.map((language) => (
                <Picker.Item key={language} label={language} value={language} />
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
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.grey,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
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
