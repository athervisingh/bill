import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = (size: number) => (width / 375) * size;

interface ProductData {
  name: string;
  price: string;
}

interface AddProductPageProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ productData, setProductData }) => {
  const navigation = useNavigation();

  const validateFields = () => {
    const { name, price } = productData;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter product name.');
      return false;
    }

    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter product price.');
      return false;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const payload = {
        name: productData.name.trim(),
        price: Number(productData.price),
      };

      console.log("Sending data:", payload);

      const response = await fetch("https://mkqfdpqq-3000.inc1.devtunnels.ms/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 🔹 Debugging info
      const text = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", text);

      // ✅ Check for 201 Created
      if (response.status === 201) {
        Alert.alert("Success", "Product saved successfully!");
        setProductData({ name: "", price: "" });
        navigation.goBack();
      } else {
        Alert.alert("Error", `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };



  return (
    <View style={styles.card}>
      <Text style={styles.header}>Add Product</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={productData?.name || ''}
          onChangeText={(text) => setProductData(prev => ({ ...prev, name: text }))}
          placeholder="Item A"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={productData?.price || ''}
          onChangeText={(text) => setProductData(prev => ({ ...prev, price: text }))}
          placeholder="99.99"
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

export default AddProductPage;
