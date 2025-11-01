import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddCustomerButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('AddCustomer' as never)}
      activeOpacity={0.7}
    >
     
      <Text style={styles.text}>Add Customer</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0000009a',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    minWidth: 200,
    width: 238,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});

export default AddCustomerButton;
