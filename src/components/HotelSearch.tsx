import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HotelSearchProps {
  adults: number;
  budget: number;
}

interface Hotel {
  id: number;
  name: string;
  price: number;
  rating: number;
}

const HotelSearch: React.FC<HotelSearchProps> = ({ adults, budget }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockHotels: Hotel[] = [
        { id: 1, name: "Luxury Hotel", price: 200, rating: 4.5 },
        { id: 2, name: "Budget Inn", price: 80, rating: 3.8 },
        { id: 3, name: "Cozy Suites", price: 150, rating: 4.2 },
      ];
      setHotels(mockHotels.filter(hotel => hotel.price <= budget / adults));
      setLoading(false);
    };

    fetchHotels();
  }, [adults, budget]);

  if (loading) {
    return <div className="text-center">Loading hotels...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Hotels</h2>
      {hotels.length === 0 ? (
        <p>No hotels found within your budget.</p>
      ) : (
        <ul className="space-y-4">
          {hotels.map(hotel => (
            <li key={hotel.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{hotel.name}</h3>
              <p>Price: ${hotel.price} per night</p>
              <p>Rating: {hotel.rating}/5</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotelSearch;