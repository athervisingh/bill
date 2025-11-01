import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = (size: number) => (width / 375) * size;

interface CustomerData {
  name: string;
  phone: string;
  firm: string;
  balance: string;
}

interface AddCustomerPageProps {
  customerData: CustomerData;
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>;
}

const AddCustomerPage: React.FC<AddCustomerPageProps> = ({ customerData, setCustomerData }) => {
  const navigation = useNavigation();

  const validateFields = () => {
    const { name, phone, firm } = customerData;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter customer name.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter phone number.');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number.');
      return false;
    }

    if (!firm.trim()) {
      Alert.alert('Validation Error', 'Please enter firm name.');
      return false;
    }

    return true;
  };

const handleSave = async () => {
  if (!validateFields()) return;

  try {
    // ✅ Prepare data
    const payload = {
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      firm: customerData.firm.trim(),
      balance: Number(customerData.balance) || 0,
    };

    console.log('Sending data:', payload);

    // ✅ API call
    const response = await fetch('https://mkqfdpqq-3000.inc1.devtunnels.ms/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // ✅ Debug logs
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', text);

    // ✅ Check for 201 created
    if (response.status === 201) {
      Alert.alert('Success', 'Customer saved successfully!');

      // Clear form
      setCustomerData({
        name: '',
        phone: '',
        firm: '',
        balance: '',
      });

      // Navigate back
      navigation.goBack();
    } else {
      throw new Error(`Failed to save customer: ${text}`);
    }
  } catch (error: any) {
    console.error('Save error:', error.message);
    Alert.alert('Error', error.message || 'Failed to save customer');
  }
};



  return (
    <View style={styles.card}>
      <Text style={styles.header}>Add Customer</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={customerData?.name || ''}
          onChangeText={(text) => setCustomerData(prev => ({ ...prev, name: text }))}
          placeholder="John Doe"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={customerData?.phone || ''}
          onChangeText={(text) => setCustomerData(prev => ({ ...prev, phone: text }))}
          placeholder="9876543210"
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Firm *</Text>
        <TextInput
          style={styles.input}
          value={customerData?.firm || ''}
          onChangeText={(text) => setCustomerData(prev => ({ ...prev, firm: text }))}
          placeholder="Acme Corp"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Balance (optional)</Text>
        <TextInput
          style={styles.input}
          value={customerData?.balance || ''}
          onChangeText={(text) => setCustomerData(prev => ({ ...prev, balance: text }))}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: scale(16),
  },
  header: {
    fontSize: scale(18),
    fontWeight: '700',
    marginBottom: scale(16),
    color: '#2C3E50',
  },
  inputContainer: {
    marginBottom: scale(12),
  },
  label: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#555',
    marginBottom: scale(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    backgroundColor: '#F9FBFC',
    fontSize: scale(15),
    color: '#000',
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#2C3E50',
    borderRadius: scale(8),
    paddingVertical: scale(10),
    alignItems: 'center',
    marginTop: scale(20),
    backgroundColor: 'transparent',
  },
  saveText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#2C3E50',
  },
});

export default AddCustomerPage;
