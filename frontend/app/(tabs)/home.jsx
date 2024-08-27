import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Home = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);

  const API_KEY = 'da17b059ac893e7c1751b1d2';

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`, {
          params: {
            access_key: API_KEY,
            symbols: toCurrency,
          },
        });

        if (response.data.success) {
          setExchangeRate(response.data.rates[toCurrency]);
        } else {
          console.error('Error fetching exchange rates', response.data.error);
        }
      } catch (error) {
        console.error('Error connecting to the API', error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const handleConvert = () => {
    if (exchangeRate && amount) {
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.grey,
          },
          headerLeft: () => <Text style={styles.headerTitle}>Home</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.headerRight}
            >
              <Ionicons name="person-sharp" size={30} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />

      <Text style={styles.title}>Currency Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.currencyRow}>
        <Text style={styles.currencyLabel}>From: {fromCurrency}</Text>
        <Text style={styles.currencyLabel}>To: {toCurrency}</Text>
      </View>

      <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>

      {convertedAmount && (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: Colors.white,
    marginBottom: 20,
    backgroundColor: Colors.lightGrey,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  currencyLabel: {
    color: Colors.white,
    fontSize: 16,
  },
  convertButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    color: Colors.white,
  },
});
