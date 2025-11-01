import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddCustomerButton from './addCustomer/AddCustomerButton';
import GenerateInvoiceButton from './generateInvoice/GenerateInvoiceButton';
import  AddProductButton  from './addProduct/AddProductButton';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AddCustomerButton />
      <GenerateInvoiceButton />
      <AddProductButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
