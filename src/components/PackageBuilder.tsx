import React, { useState } from 'react';

const PackageBuilder: React.FC = () => {
  const [includeFlight, setIncludeFlight] = useState(false);
  const [includeHotel, setIncludeHotel] = useState(false);
  const [includeMeals, setIncludeMeals] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    if (includeFlight) total += 4999;
    if (includeHotel) total += 7999;
    if (includeMeals) total += 1999;
    return total;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Custom Package Builder</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={includeFlight}
            onChange={() => setIncludeFlight(!includeFlight)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Include Flight (From ₹4,999)</span>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={includeHotel}
            onChange={() => setIncludeHotel(!includeHotel)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Include Hotel (From ₹7,999/night)</span>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={includeMeals}
            onChange={() => setIncludeMeals(!includeMeals)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Include Meal Package (From ₹1,999/day)</span>
        </div>
        <div className="mt-6">
          <p className="text-xl font-bold">Total Estimated Cost: ₹{calculateTotal()}</p>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Build My Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageBuilder;