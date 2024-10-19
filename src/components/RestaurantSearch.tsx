import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';

interface RestaurantSearchProps {
  adults: number;
  budget: number;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  pricePerMeal: number;
  rating: number;
}

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({ adults, budget }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockRestaurants: Restaurant[] = [
        { id: 1, name: "Spice Garden", cuisine: "Indian", pricePerMeal: 15, rating: 4.3 },
        { id: 2, name: "Pasta Paradise", cuisine: "Italian", pricePerMeal: 20, rating: 4.5 },
        { id: 3, name: "Sushi Spot", cuisine: "Japanese", pricePerMeal: 25, rating: 4.7 },
      ];
      const dailyBudget = budget / 3; // Assuming 3 meals per day
      setRestaurants(mockRestaurants.filter(restaurant => restaurant.pricePerMeal * adults <= dailyBudget));
      setLoading(false);
    };

    fetchRestaurants();
  }, [adults, budget]);

  if (loading) {
    return <div className="text-center">Loading restaurants...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>No restaurants found within your budget.</p>
      ) : (
        <ul className="space-y-4">
          {restaurants.map(restaurant => (
            <li key={restaurant.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{restaurant.name}</h3>
              <p>Cuisine: {restaurant.cuisine}</p>
              <p>Price per meal: ${restaurant.pricePerMeal}</p>
              <p>Rating: {restaurant.rating}/5</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantSearch;