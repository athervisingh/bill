import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../components/homePage/HomePage";
import AddCustomerPage from "../components/homePage/addCustomer/addCustomerPage/AddCustomerPage";
import InvoiceForm from "../components/homePage/generateInvoice/invoice/InvoiceForm";
import AddProductPage from "../components/homePage/addProduct/addProductPage/AddProductPage";

const Stack = createNativeStackNavigator();
export type RootStackParamList = {
  InvoiceForm: undefined;
  InvoiceViewer: { invoiceId: string };
};

const MainNavigation = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    firm: '',
    balance: '',
  });

  const [productData, setProductData] = useState({
    name: '',
    price: '',
  });

  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddCustomer" options={{ title: 'Add Customer' }}>
        {props => (
          <AddCustomerPage
            {...props}
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="InvoiceForm"
        component={InvoiceForm}
        options={{ title: 'Generate Invoice' }}
      />

      <Stack.Screen name="AddProduct" options={{ title: 'Add Product' }}>
        {props => (
          <AddProductPage
            {...props}
            productData={productData}
            setProductData={setProductData}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainNavigation;
