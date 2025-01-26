import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-2">{company.comp_name}</h2>
        <h2 className="text-l font-semibold text-orange-600 mb-2">{company.comp_id}</h2>
      </div>
      <p className="text-gray-600 mb-4">Email: {company.comp_email}</p>
      <Link
        to={`/company/${company.comp_id}`}
        className="text-orange-600 hover:text-orange-800 font-medium"
      >
        View Details
      </Link>
    </div>
  );
};

export default CompanyCard;
