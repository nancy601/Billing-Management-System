import React, { useState, useEffect } from 'react';
import CompanyCard from '../molecules/CompanyCard';
import { fetchCompanies } from '../services/api';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to fetch companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>
      {companies.length === 0 ? (
        <p className="text-center text-gray-600">No companies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <CompanyCard key={company.comp_id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyList;

