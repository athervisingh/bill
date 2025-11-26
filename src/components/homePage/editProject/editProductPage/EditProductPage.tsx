import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Alert,
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = (size: number) => (width / 375) * size;

interface Product {
  id: string;
  name: string;
  price: number;
}

const EditProductPage: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState({ name: '', price: '' });

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://mkqfdpqq-3000.inc1.devtunnels.ms/products');
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        Alert.alert('Error', 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditData({
      name: product.name,
      price: product.price.toString(),
    });
  };

  const validateFields = () => {
    const { name, price } = editData;

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

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    if (!validateFields()) return;

    try {
      const payload = {
        name: editData.name.trim(),
        price: Number(editData.price),
      };

      console.log('Updating product:', selectedProduct.id, payload);

      const response = await fetch(
        `https://mkqfdpqq-3000.inc1.devtunnels.ms/products/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', text);

      if (response.ok) {
        Alert.alert('Success', 'Product updated successfully!');
        setSelectedProduct(null);
        setEditData({ name: '', price: '' });
        setSearchQuery('');
        fetchProducts(); // Refresh the list
      } else {
        Alert.alert('Error', `Failed to update: ${response.status}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setEditData({ name: '', price: '' });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productItem,
        selectedProduct?.id === item.id && styles.selectedProduct,
      ]}
      onPress={() => handleSelectProduct(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedProduct ? (
        // Product Search & List View
        <View style={styles.card}>
          <Text style={styles.header}>Edit Product</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Search Product</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by product name..."
            />
          </View>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No products found' : 'No products available'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderProductItem}
              style={styles.productList}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      ) : (
        // Edit Form View
        <View style={styles.card}>
          <Text style={styles.header}>Edit Product</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={editData.name}
              onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
              placeholder="Item A"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price *</Text>
            <TextInput
              style={styles.input}
              value={editData.price}
              onChangeText={(text) => setEditData(prev => ({ ...prev, price: text }))}
              placeholder="99.99"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
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
  productList: {
    marginTop: scale(8),
  },
  listContent: {
    paddingBottom: scale(16),
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(8),
    backgroundColor: '#F9FBFC',
  },
  selectedProduct: {
    borderColor: '#2C3E50',
    backgroundColor: '#E8EEF4',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  productPrice: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: scale(20),
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: scale(10),
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: '#95A5A6',
    backgroundColor: 'transparent',
  },
  cancelText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#95A5A6',
  },
  updateButton: {
    borderColor: '#2C3E50',
    backgroundColor: '#2C3E50',
  },
  updateText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: scale(12),
    fontSize: scale(14),
    color: '#555',
  },
  emptyContainer: {
    marginTop: scale(32),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(14),
    color: '#95A5A6',
  },
});

export default EditProductPage;
