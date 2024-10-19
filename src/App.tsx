import React, { useState } from 'react';
import { Search, Plane, Hotel, Utensils } from 'lucide-react';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import PackageBuilder from './components/PackageBuilder';

function App() {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/search/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch results. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TravelEase</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-200">Home</a>
            <a href="#" className="hover:text-blue-200">My Trips</a>
            <a href="#" className="hover:text-blue-200">Deals</a>
            <a href="#" className="hover:text-blue-200">Contact</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <SearchForm onSearch={handleSearch} />
        {searchResults && <Results results={searchResults} />}
        <PackageBuilder />
      </main>
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-gray-400">Your one-stop solution for travel planning and booking.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Search Flights</a></li>
                <li><a href="#" className="hover:text-white">Find Hotels</a></li>
                <li><a href="#" className="hover:text-white">Restaurant Deals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@travelease.com</li>
                <li>Phone: +91 1234567890</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Newsletter</h4>
              <div className="flex">
                <input type="email" placeholder="Enter your email" className="p-2 rounded-l w-full" />
                <button className="bg-blue-600 px-4 rounded-r hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;