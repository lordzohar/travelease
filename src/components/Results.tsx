import React from 'react';
import { Hotel, Plane, Utensils } from 'lucide-react';

interface ResultsProps {
  results: {
    hotels: any[];
    flights: any[];
    restaurants: any[];
    meal_packages: any[];
  };
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Hotel className="mr-2" /> Hotel Deals
        </h3>
        <div className="space-y-4">
          {results.hotels.slice(0, 3).map((hotel) => (
            <div key={hotel.hotel_id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{hotel.name}</p>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                </div>
                <p className="text-lg font-bold text-blue-600">₹{hotel.price}/night</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{hotel.rating} ★</p>
            </div>
          ))}
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View All Hotels
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Plane className="mr-2" /> Flight Deals
        </h3>
        <div className="space-y-4">
          {results.flights.slice(0, 3).map((flight) => (
            <div key={flight.flight_id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{flight.airline}</p>
                  <p className="text-sm text-gray-600">{flight.departure.iataCode} → {flight.arrival.iataCode}</p>
                </div>
                <p className="text-lg font-bold text-blue-600">₹{flight.price}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{flight.stops} stops • {flight.duration}</p>
            </div>
          ))}
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View All Flights
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Utensils className="mr-2" /> Dining Packages
        </h3>
        <div className="space-y-4">
          {results.meal_packages.slice(0, 3).map((mealPackage, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">3 Meals Package</p>
                  <p className="text-sm text-gray-600">Multiple Restaurants</p>
                </div>
                <p className="text-lg font-bold text-blue-600">₹{mealPackage.total_cost.toFixed(2)}/day</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Breakfast • Lunch • Dinner
              </p>
            </div>
          ))}
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View All Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;