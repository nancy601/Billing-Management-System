import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyDetails, updateSubscription, fetchPlans } from '../services/api';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const SubscriptionManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCompanyDetails(id), fetchPlans()])
      .then(([companyData, plansData]) => {
        setSubscription(companyData.subscription || {
          plan_id: '',
          start_date: '',
          end_date: '',
          transaction_status: ''
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
      await updateSubscription(id, subscription);
      navigate(`/company/${id}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleChange = (e) => {
    setSubscription({ ...subscription, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700 mb-1">
            Plan
          </label>
          <select
            id="plan_id"
            name="plan_id"
            value={subscription.plan_id}
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
          value={subscription.start_date.split('T')[0]}
          onChange={handleChange}
          required
        />
        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={subscription.end_date.split('T')[0]}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="transaction_status" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Status
          </label>
          <select
            id="transaction_status"
            name="transaction_status"
            value={subscription.transaction_status}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
        <Button type="submit">Update Subscription</Button>
      </form>
    </div>
  );
};

export default SubscriptionManagement;

