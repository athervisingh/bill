import { CustomerPayload, ApiResponse } from './types';

const BASE_URL = 'https://mkqfdpqq-3000.inc1.devtunnels.ms/customers';

/**
 * Add a new customer
 */
export const addCustomer = async (payload: CustomerPayload): Promise<ApiResponse> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    return { status: response.status, data: text };
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};

/**
 * Get all customers
 */
export const getAllCustomers = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch customers');
  }
};

/**
 * Delete a customer by ID
 */
export const deleteCustomer = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const text = await response.text();
    return { status: response.status, data: text };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete customer');
  }
};

/**
 * Update a customer by ID
 */
export const updateCustomer = async (id: string, payload: CustomerPayload): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    return { status: response.status, data: text };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update customer');
  }
};
