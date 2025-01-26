import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyDetails, updateBillingDetails, fetchPlans } from '../services/api';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const BillingManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCompanyDetails(id), fetchPlans()])
      .then(([companyData, plansData]) => {
        setBilling(companyData.billing || {
          credits: 0,
          status: 'Inactive',
          billing_cycle: '',
          payment_method: '',
          amount_paid: 0,
          currency: 'USD',
          plan_id: '',
          start_date: '',
          end_date: ''
        });
        setPlans(plansData || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBillingDetails(id, billing);
      navigate(`/company/${id}`);
    } catch (error) {
      console.error('Error updating billing details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling(prevBilling => {
      const updatedBilling = { ...prevBilling, [name]: value };
      
      // If plan_id or start_date changes, update the end_date
      if (name === 'plan_id' || name === 'start_date') {
        const selectedPlan = plans.find(plan => plan.plan_id.toString() === updatedBilling.plan_id);
        if (selectedPlan && updatedBilling.start_date) {
          updatedBilling.end_date = calculateEndDate(updatedBilling.start_date, selectedPlan.plan_type);
        }
      }
      
      return updatedBilling;
    });
  };

  const calculateEndDate = (startDate, planType) => {
    const start = new Date(startDate);
    let end;

    switch (planType) {
      case '14 days free trial':
        end = new Date(start.setDate(start.getDate() + 14));
        break;
      case 'monthly':
        end = new Date(start.setMonth(start.getMonth() + 1));
        break;
      case 'annually':
        end = new Date(start.setFullYear(start.getFullYear() + 1));
        break;
      default:
        end = start;
    }

    return end.toISOString().split('T')[0];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Billing and Subscription Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Credits"
          name="credits"
          type="number"
          value={billing.credits}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={billing.status}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        {/* <div>
          <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700 mb-1">
            Billing Cycle
          </label>
          <select
            id="billing_cycle"
            name="billing_cycle"
            value={billing.billing_cycle}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div> */}
        <Input
          label="Payment Method"
          name="payment_method"
          type="text"
          value={billing.payment_method}
          onChange={handleChange}
          required
        />
        <Input
          label="Amount Paid"
          name="amount_paid"
          type="number"
          step="0.01"
          value={billing.amount_paid}
          onChange={handleChange}
          required
        />
        <Input
          label="Currency"
          name="currency"
          type="text"
          value={billing.currency}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700 mb-1">
            Plan
          </label>
          <select
            id="plan_id"
            name="plan_id"
            value={billing.plan_id}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a Plan</option>
            {plans.map(plan => (
              <option key={plan.plan_id} value={plan.plan_id}>
                {plan.name} - {plan.plan_type} - {plan.pricing} {plan.currency}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Start Date"
          name="start_date"
          type="date"
          value={billing.start_date}
          onChange={handleChange}
          required
        />
        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={billing.end_date}
          onChange={handleChange}
          required
          disabled
        />
        <Button type="submit">Update Billing and Subscription</Button>
      </form>
    </div>
  );
};

export default BillingManagement;

