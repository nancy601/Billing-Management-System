import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCompanyDetails, fetchPlans } from '../services/api';
import Button from '../atoms/Button';
import { formatDate } from '../utils/formatDate';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyData, plansData] = await Promise.all([
          fetchCompanyDetails(id),
          fetchPlans()
        ]);
        setCompany(companyData);
        setPlans(plansData || []);
        
        // Debug logging
        console.log('Company Data:', companyData);
        console.log('Plans Data:', plansData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getPlanName = (planId) => {
    if (!planId) return 'No plan selected';
    const plan = plans.find(p => p.plan_id.toString() === planId.toString());
    if (plan) {
      return `${plan.name} ${plan.plan_type}`;
    } else {
      console.warn(`Plan not found for ID: ${planId}`);
      return 'Unknown Plan';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!company) return <div className="text-center">Company not found</div>;

  const { company: companyInfo, billing } = company;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6">{companyInfo?.comp_name || 'N/A'}</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
        <p className="mb-2"><span className="font-medium">Email:</span> {companyInfo?.comp_email || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Description:</span> {companyInfo?.company_description || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">GST Number:</span> {companyInfo?.comp_gst_number || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Address:</span> {companyInfo?.comp_addr || 'N/A'}</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Billing and Subscription Details</h2>
        <p className="mb-2"><span className="font-medium">Credits:</span> {billing?.credits || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Status:</span> {billing?.status || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Billing Cycle:</span> {billing?.billing_cycle || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Payment Method:</span> {billing?.payment_method || 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">Amount Paid:</span> {billing?.amount_paid ? `${billing.amount_paid} ${billing.currency}` : 'N/A'}</p>
        <p className="mb-2">
          <span className="font-medium">Plan ID:</span> {billing?.plan_id || 'N/A'}
        </p>
        <p className="mb-2">
          <span className="font-medium">Plan Name:</span> {getPlanName(billing?.plan_id)}
        </p>
        <p className="mb-2"><span className="font-medium">Start Date:</span> {billing?.start_date ? formatDate(billing.start_date) : 'N/A'}</p>
        <p className="mb-2"><span className="font-medium">End Date:</span> {billing?.end_date ? formatDate(billing.end_date) : 'N/A'}</p>
      </section>
      
      <div className="flex justify-center mt-6">
        <Link to={`/billing/${id}`}>
          <Button>Manage Billing and Subscription</Button>
        </Link>
      </div>
    </div>
  );
};

export default CompanyDetails;

