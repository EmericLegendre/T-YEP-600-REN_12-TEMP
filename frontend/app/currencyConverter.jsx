import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const CurrencyConverter = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  const API_KEY = 'da17b059ac893e7c1751b1d2';

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
        
        if (response.data && response.data.conversion_rates) {
          setExchangeRate(response.data.conversion_rates[toCurrency]);
        } else {
          console.error('Erreur lors de la récupération des taux de change', response.data);
        }
      } catch (error) {
        console.error('Erreur de connexion à l\'API', error);
      }
    };
  
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`);

        if (response.data && response.data.supported_codes) {
          const currencies = response.data.supported_codes.map((currency) => ({
            code: currency[0],
            name: currency[1],
          }));

          currencies.sort((a, b) => a.name.localeCompare(b.name));

          setCurrencies(currencies);
        } else {
          console.error('Erreur lors de la récupération des devises', response.data);
        }
      } catch (error) {
        console.error('Erreur de connexion à l\'API', error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (exchangeRate && amount) {
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
    }
  }, [amount, exchangeRate, fromCurrency, toCurrency]);

  const handleConvert = () => {
    if (exchangeRate && amount) {
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
    }
  };

  const swapCurrencies = () => {
    setFromCurrency((prev) => {
      const newToCurrency = toCurrency;
      setToCurrency(prev);
      return newToCurrency;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.secondColor,
          },
          headerLeft: () => <Text style={styles.headerTitle}>Currency Converter</Text>,
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.currencyCode}>{fromCurrency}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={fromCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setFromCurrency(itemValue);
              setAmount('1');
            }}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency.code} label={currency.name} value={currency.code} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <Ionicons name="swap-vertical-outline" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={toCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setToCurrency(itemValue);
              setAmount('1');
            }}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency.code} label={currency.name} value={currency.code} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>

      {convertedAmount && (
        <Text style={styles.result}>
          {convertedAmount} {toCurrency}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default CurrencyConverter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginLeft: 15,
  },
  headerLeftButton: {
    marginLeft: 15,
  },
  inputContainer: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: Colors.black,
    textAlign: 'center',
  },
  currencyCode: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.black,
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pickerWrapper: {
    width: '100%',
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  swapButton: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  convertButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    color: Colors.black,
  },
});
