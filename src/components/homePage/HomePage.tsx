import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddCustomerButton from './addCustomer/AddCustomerButton';
import GenerateInvoiceButton from './generateInvoice/GenerateInvoiceButton';
import  AddProductButton  from './addProduct/AddProductButton';
import GenerateCreditButton from './credit/GenerateCreditButton';


const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AddCustomerButton />
      <GenerateInvoiceButton />
      <AddProductButton />
      <GenerateCreditButton/>
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
