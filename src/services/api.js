import {
    COMPANIES_ENDPOINT,
    COMPANY_DETAILS_ENDPOINT,
    BILLING_ENDPOINT,
    PLANS_ENDPOINT
  } from '../constants/apiEndpoints';
  
  export const fetchCompanies = async () => {
    const response = await fetch(COMPANIES_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  };
  
  export const fetchCompanyDetails = async (id) => {
    const response = await fetch(`${COMPANY_DETAILS_ENDPOINT}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }
    return response.json();
  };
  
  export const updateBillingDetails = async (id, billingData) => {
    const response = await fetch(`${BILLING_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credits: billingData.credits,
        status: billingData.status,
        billing_cycle: billingData.billing_cycle,
        payment_method: billingData.payment_method,
        amount_paid: billingData.amount_paid,
        currency: billingData.currency,
        plan_id: billingData.plan_id,
        start_date: billingData.start_date,
        end_date: billingData.end_date
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update billing details');
    }
    return response.json();
  };
  
  export const fetchPlans = async () => {
    const response = await fetch(PLANS_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    return response.json();
  };
  
  