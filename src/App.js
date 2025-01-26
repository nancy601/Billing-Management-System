import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './organisms/Header';
import CompanyList from './organisms/CompanyList';
import CompanyDetails from './organisms/CompanyDetails';
import BillingManagement from './organisms/BillingManagement';
// import SubscriptionManagement from './organisms/SubscriptionManagement';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<CompanyList />} />
            <Route path="/company/:id" element={<CompanyDetails />} />
            <Route path="/billing/:id" element={<BillingManagement />} />
            {/* <Route path="/subscription/:id" element={<SubscriptionManagement />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
