import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const FilterModal = ({ visible, onClose, onSelect }) => {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const [initialContinent, setInitialContinent] = useState('All');
  const [initialLanguage, setInitialLanguage] = useState('All');

  const continents = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'Antarctic']
    .slice(1)
    .sort()
    .reduce((acc, item) => [...acc, item], ['All']);

  const languages = ['All', 'Arabic', 'English', 'French', 'Spanish', 'Italian', 'Portuguese', 'German', 'Dutch', 'Chinese', 'Russian']
    .slice(1)
    .sort()
    .reduce((acc, item) => [...acc, item], ['All']);

  useEffect(() => {
    if (visible) {
      setInitialContinent(selectedContinent);
      setInitialLanguage(selectedLanguage);
    }
  }, [visible]);

  const handleApply = () => {
    onSelect({ continent: selectedContinent, language: selectedLanguage });
    onClose();
  };

  const handleReset = () => {
    setSelectedContinent('All');
    setSelectedLanguage('All');
  };

  const handleClose = () => {
    setSelectedContinent(initialContinent);
    setSelectedLanguage(initialLanguage);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.mainTitle}>Filters</Text>

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

                <Text style={styles.filterTitle}>Language</Text>
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
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIconText: {
    fontSize: 20,
    color: Colors.black,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.black,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
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
    marginTop: 5,
    marginBottom: 10,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  resetButton: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  resetButtonText: {
    fontSize: 16,
  },
});

export default FilterModal;
