import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';

interface FlightSearchProps {
  adults: number;
  budget: number;
}

interface Flight {
  id: number;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ adults, budget }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFlights: Flight[] = [
        { id: 1, airline: "Air India", price: 300, departureTime: "10:00 AM", arrivalTime: "12:00 PM" },
        { id: 2, airline: "IndiGo", price: 250, departureTime: "2:00 PM", arrivalTime: "4:00 PM" },
        { id: 3, airline: "SpiceJet", price: 200, departureTime: "6:00 PM", arrivalTime: "8:00 PM" },
      ];
      setFlights(mockFlights.filter(flight => flight.price * adults <= budget));
      setLoading(false);
    };

    fetchFlights();
  }, [adults, budget]);

  if (loading) {
    return <div className="text-center">Loading flights...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
      {flights.length === 0 ? (
        <p>No flights found within your budget.</p>
      ) : (
        <ul className="space-y-4">
          {flights.map(flight => (
            <li key={flight.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{flight.airline}</h3>
              <p>Price: ${flight.price} per person</p>
              <p>Departure: {flight.departureTime}</p>
              <p>Arrival: {flight.arrivalTime}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlightSearch;