from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
ZOMATO_API_KEY = os.getenv("ZOMATO_API_KEY")
AMADEUS_API_KEY = os.getenv("AMADEUS_API_KEY")
AMADEUS_API_SECRET = os.getenv("AMADEUS_API_SECRET")

class SearchRequest(BaseModel):
    city: str
    checkin: str
    checkout: str
    adults: int
    children: Optional[int] = 0
    rooms: int
    max_hotel_price: float
    max_flight_price: float
    max_restaurant_price: float

class Hotel(BaseModel):
    hotel_id: str
    name: str
    price: float
    rating: float
    address: str

class Flight(BaseModel):
    flight_id: str
    airline: str
    price: float
    departure: dict
    arrival: dict
    duration: str
    stops: int

class Restaurant(BaseModel):
    restaurant_id: int
    name: str
    cuisine: str
    average_cost_for_two: float
    rating: float
    location: str

class MealPackage(BaseModel):
    total_cost: float
    meals: dict

class SearchResponse(BaseModel):
    hotels: List[Hotel]
    flights: List[Flight]
    restaurants: List[Restaurant]
    meal_packages: List[MealPackage]

def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_API_KEY,
        "client_secret": AMADEUS_API_SECRET
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise HTTPException(status_code=500, detail="Failed to get Amadeus token")

def search_hotels(city: str, checkin: str, checkout: str, adults: int, rooms: int, max_price: float):
    url = "https://booking-com.p.rapidapi.com/v1/hotels/search"
    querystring = {
        "checkin_date": checkin,
        "dest_type": "city",
        "units": "metric",
        "checkout_date": checkout,
        "adults_number": adults,
        "order_by": "price",
        "dest_id": city,  # You might need to use their location API to get the correct dest_id
        "filter_by_currency": "INR",
        "locale": "en-gb",
        "room_number": rooms,
        "price_max": max_price
    }
    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        hotels_data = response.json()["result"]
        return [
            Hotel(
                hotel_id=hotel["hotel_id"],
                name=hotel["hotel_name"],
                price=hotel["price_breakdown"]["gross_price"],
                rating=hotel.get("review_score", 0),
                address=hotel["address"]
            )
            for hotel in hotels_data if hotel["price_breakdown"]["gross_price"] <= max_price
        ]
    else:
        raise HTTPException(status_code=500, detail="Failed to fetch hotels")

def search_flights(origin: str, destination: str, date: str, adults: int, max_price: float):
    url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
    headers = {
        "Authorization": f"Bearer {get_amadeus_token()}"
    }
    params = {
        "originLocationCode": origin,
        "destinationLocationCode": destination,
        "departureDate": date,
        "adults": adults,
        "maxPrice": max_price,
        "currencyCode": "INR",
        "max": 250
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        flights_data = response.json()["data"]
        return [
            Flight(
                flight_id=flight["id"],
                airline=flight["validatingAirlineCodes"][0],
                price=float(flight["price"]["total"]),
                departure=flight["itineraries"][0]["segments"][0]["departure"],
                arrival=flight["itineraries"][0]["segments"][-1]["arrival"],
                duration=flight["itineraries"][0]["duration"],
                stops=len(flight["itineraries"][0]["segments"]) - 1
            )
            for flight in flights_data if float(flight["price"]["total"]) <= max_price
        ]
    else:
        raise HTTPException(status_code=500, detail="Failed to fetch flights")

def search_restaurants(city: str, max_price: float):
    url = "https://developers.zomato.com/api/v2.1/search"
    headers = {
        "user-key": ZOMATO_API_KEY
    }
    params = {
        "entity_id": city,  # You might need to use their location API to get the correct entity_id
        "entity_type": "city",
        "count": 20,
        "sort": "cost",
        "order": "asc"
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        restaurants_data = response.json()["restaurants"]
        return [
            Restaurant(
                restaurant_id=restaurant["restaurant"]["id"],
                name=restaurant["restaurant"]["name"],
                cuisine=restaurant["restaurant"]["cuisines"],
                average_cost_for_two=float(restaurant["restaurant"]["average_cost_for_two"]),
                rating=float(restaurant["restaurant"]["user_rating"]["aggregate_rating"]),
                location=restaurant["restaurant"]["location"]["address"]
            )
            for restaurant in restaurants_data
            if float(restaurant["restaurant"]["average_cost_for_two"]) <= max_price
        ]
    else:
        raise HTTPException(status_code=500, detail="Failed to fetch restaurants")

def create_meal_packages(restaurants: List[Restaurant], max_price: float):
    packages = []
    for _ in range(5):
        breakfast = restaurants[0]
        lunch = restaurants[1] if len(restaurants) > 1 else restaurants[0]
        dinner = restaurants[2] if len(restaurants) > 2 else restaurants[0]
        total_cost = (breakfast.average_cost_for_two + lunch.average_cost_for_two + dinner.average_cost_for_two) / 2
        if total_cost <= max_price:
            packages.append(MealPackage(
                total_cost=round(total_cost, 2),
                meals={
                    "breakfast": {"restaurant": breakfast.name, "cost": breakfast.average_cost_for_two / 2},
                    "lunch": {"restaurant": lunch.name, "cost": lunch.average_cost_for_two / 2},
                    "dinner": {"restaurant": dinner.name, "cost": dinner.average_cost_for_two / 2}
                }
            ))
    return packages

@app.post("/api/search/all", response_model=SearchResponse)
async def search_all(search: SearchRequest):
    try:
        hotels = search_hotels(search.city, search.checkin, search.checkout, search.adults, search.rooms, search.max_hotel_price)
        flights = search_flights("DEL", search.city[:3].upper(), search.checkin, search.adults, search.max_flight_price)
        restaurants = search_restaurants(search.city, search.max_restaurant_price)
        meal_packages = create_meal_packages(restaurants, search.max_restaurant_price)

        return SearchResponse(
            hotels=hotels,
            flights=flights,
            restaurants=restaurants,
            meal_packages=meal_packages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)