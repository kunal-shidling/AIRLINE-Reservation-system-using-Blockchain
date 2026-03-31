"""
Flight Recommendation Engine
Simple rule-based recommendation system for flight suggestions
"""

class RecommendationEngine:
    """
    Rule-based flight recommendation engine
    Demonstrates AI concepts without complex ML
    """

    def __init__(self):
        # Popular routes (for demonstration)
        self.popular_routes = [
            {'origin': 'DEL', 'destination': 'BOM', 'popularity': 95},
            {'origin': 'DEL', 'destination': 'BLR', 'popularity': 90},
            {'origin': 'BOM', 'destination': 'BLR', 'popularity': 85},
            {'origin': 'DEL', 'destination': 'HYD', 'popularity': 80},
            {'origin': 'BOM', 'destination': 'GOI', 'popularity': 75},
        ]

        # Price ranges by route
        self.price_ranges = {
            'domestic_short': {'min': 2000, 'max': 5000},
            'domestic_long': {'min': 4000, 'max': 8000},
            'international': {'min': 10000, 'max': 50000}
        }

    def recommend_flights(self, user_preferences, available_flights):
        """
        Recommend flights based on user preferences

        Args:
            user_preferences (dict): User's travel preferences
            available_flights (list): List of available flights

        Returns:
            list: Sorted list of recommended flights
        """
        if not available_flights:
            return []

        # Score each flight
        scored_flights = []
        for flight in available_flights:
            score = self._calculate_flight_score(flight, user_preferences)
            scored_flights.append({
                'flight': flight,
                'recommendationScore': score,
                'reasons': self._get_recommendation_reasons(flight, user_preferences)
            })

        # Sort by score (descending)
        scored_flights.sort(key=lambda x: x['recommendationScore'], reverse=True)

        return scored_flights[:10]  # Return top 10

    def _calculate_flight_score(self, flight, preferences):
        """
        Calculate recommendation score for a flight

        Args:
            flight (dict): Flight details
            preferences (dict): User preferences

        Returns:
            float: Recommendation score (0-100)
        """
        score = 50  # Base score

        # Price preference
        if preferences.get('pricePreference') == 'LOW':
            # Favor cheaper flights
            if flight.get('price', {}).get('economy', 0) < 5000:
                score += 20
        elif preferences.get('pricePreference') == 'COMFORT':
            # Favor business class availability
            if flight.get('availableSeats', {}).get('business', 0) > 0:
                score += 15

        # Time preference
        departure_hour = self._get_hour_from_datetime(flight.get('departureTime', ''))
        time_pref = preferences.get('timePreference', '')

        if time_pref == 'MORNING' and 6 <= departure_hour < 12:
            score += 15
        elif time_pref == 'AFTERNOON' and 12 <= departure_hour < 18:
            score += 15
        elif time_pref == 'EVENING' and 18 <= departure_hour < 24:
            score += 15

        # Popular route bonus
        route_key = f"{flight.get('origin', {}).get('airportCode', '')}_{flight.get('destination', {}).get('airportCode', '')}"
        if self._is_popular_route(route_key):
            score += 10

        # Direct flight bonus
        if flight.get('isDirect', True):
            score += 10

        # Seat availability
        total_seats = sum(flight.get('availableSeats', {}).values())
        if total_seats > 50:
            score += 5
        elif total_seats < 10:
            score -= 5  # Discourage nearly full flights

        # Airline reputation (simplified)
        popular_airlines = ['Air India', 'IndiGo', 'Vistara', 'SpiceJet']
        if flight.get('airline', '') in popular_airlines:
            score += 8

        # Duration preference (shorter is better for domestic)
        duration = flight.get('duration', 180)  # in minutes
        if duration < 120:
            score += 10
        elif duration > 300:
            score -= 5

        return min(max(score, 0), 100)  # Clamp between 0-100

    def _get_recommendation_reasons(self, flight, preferences):
        """
        Generate human-readable reasons for recommendation

        Args:
            flight (dict): Flight details
            preferences (dict): User preferences

        Returns:
            list: List of recommendation reasons
        """
        reasons = []

        # Price
        economy_price = flight.get('price', {}).get('economy', 0)
        if economy_price < 3000:
            reasons.append("Great price")
        elif economy_price < 5000:
            reasons.append("Good value")

        # Timing
        departure_hour = self._get_hour_from_datetime(flight.get('departureTime', ''))
        if 6 <= departure_hour < 12:
            reasons.append("Morning flight")
        elif 18 <= departure_hour < 22:
            reasons.append("Evening flight")

        # Popularity
        route_key = f"{flight.get('origin', {}).get('airportCode', '')}_{flight.get('destination', {}).get('airportCode', '')}"
        if self._is_popular_route(route_key):
            reasons.append("Popular route")

        # Availability
        total_seats = sum(flight.get('availableSeats', {}).values())
        if total_seats > 50:
            reasons.append("Good availability")

        # Duration
        duration = flight.get('duration', 180)
        if duration < 120:
            reasons.append("Short flight")

        return reasons[:3]  # Return top 3 reasons

    def _is_popular_route(self, route_key):
        """Check if route is in popular routes"""
        parts = route_key.split('_')
        if len(parts) != 2:
            return False

        origin, destination = parts
        for route in self.popular_routes:
            if route['origin'] == origin and route['destination'] == destination:
                return True
        return False

    def _get_hour_from_datetime(self, datetime_str):
        """Extract hour from datetime string"""
        try:
            from datetime import datetime
            dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
            return dt.hour
        except:
            return 12  # Default to noon

    def predict_demand(self, route, date):
        """
        Predict demand for a route (simplified)

        Args:
            route (dict): Origin and destination
            date (str): Travel date

        Returns:
            dict: Demand prediction
        """
        import random

        # Simple rule-based prediction
        base_demand = 60

        # Popular route increases demand
        route_key = f"{route.get('origin', '')}_{route.get('destination', '')}"
        if self._is_popular_route(route_key):
            base_demand += 20

        # Weekend increases demand
        try:
            from datetime import datetime
            dt = datetime.fromisoformat(date)
            if dt.weekday() in [4, 5, 6]:  # Friday, Saturday, Sunday
                base_demand += 15
        except:
            pass

        # Add some randomness
        demand = base_demand + random.randint(-10, 10)
        demand = min(max(demand, 0), 100)

        # Categorize demand
        if demand >= 80:
            category = 'HIGH'
            suggestion = 'Book soon - high demand expected'
        elif demand >= 50:
            category = 'MEDIUM'
            suggestion = 'Moderate demand - book within a week'
        else:
            category = 'LOW'
            suggestion = 'Low demand - flexible booking'

        return {
            'demandScore': demand,
            'category': category,
            'suggestion': suggestion,
            'confidence': 0.75  # Simplified confidence score
        }

    def get_popular_destinations(self, origin=None):
        """
        Get popular destinations

        Args:
            origin (str): Origin airport code (optional)

        Returns:
            list: Popular destinations
        """
        if origin:
            destinations = [
                route for route in self.popular_routes
                if route['origin'] == origin
            ]
            return sorted(destinations, key=lambda x: x['popularity'], reverse=True)
        else:
            # Return all unique destinations
            all_destinations = {}
            for route in self.popular_routes:
                dest = route['destination']
                if dest not in all_destinations:
                    all_destinations[dest] = {
                        'airportCode': dest,
                        'popularity': route['popularity']
                    }

            return sorted(all_destinations.values(), key=lambda x: x['popularity'], reverse=True)
