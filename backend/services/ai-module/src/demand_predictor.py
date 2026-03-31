"""
Demand Predictor Module
Predicts flight demand based on historical patterns
"""

import random
from datetime import datetime, timedelta


class DemandPredictor:
    """
    Simple demand prediction system
    Uses rule-based logic to predict flight demand
    """

    def __init__(self):
        # Seasonal demand multipliers
        self.seasonal_factors = {
            'winter': 1.2,   # Dec-Feb (holidays)
            'spring': 1.0,   # Mar-May
            'summer': 1.3,   # Jun-Aug (vacation season)
            'autumn': 0.9    # Sep-Nov
        }

        # Day of week factors
        self.day_factors = {
            0: 0.8,  # Monday
            1: 0.9,  # Tuesday
            2: 0.9,  # Wednesday
            3: 1.0,  # Thursday
            4: 1.2,  # Friday
            5: 1.3,  # Saturday
            6: 1.1   # Sunday
        }

    def predict_price_trend(self, route, current_price, days_until_departure):
        """
        Predict price trend for a flight

        Args:
            route (dict): Route information
            current_price (float): Current flight price
            days_until_departure (int): Days until departure

        Returns:
            dict: Price prediction
        """
        # Price generally increases as departure date approaches
        base_multiplier = 1.0

        if days_until_departure <= 3:
            base_multiplier = 1.5  # Last-minute surge
        elif days_until_departure <= 7:
            base_multiplier = 1.3
        elif days_until_departure <= 14:
            base_multiplier = 1.1
        elif days_until_departure <= 30:
            base_multiplier = 1.0
        else:
            base_multiplier = 0.9  # Early bird discount

        predicted_price = current_price * base_multiplier

        # Determine trend
        price_change = ((predicted_price - current_price) / current_price) * 100

        if price_change > 10:
            trend = 'INCREASING'
            recommendation = 'Book now to save money'
        elif price_change < -10:
            trend = 'DECREASING'
            recommendation = 'Wait a few days for better prices'
        else:
            trend = 'STABLE'
            recommendation = 'Good time to book'

        return {
            'currentPrice': current_price,
            'predictedPrice': round(predicted_price, 2),
            'priceChange': round(price_change, 2),
            'trend': trend,
            'recommendation': recommendation,
            'confidence': self._calculate_confidence(days_until_departure)
        }

    def predict_occupancy(self, flight_data):
        """
        Predict flight occupancy

        Args:
            flight_data (dict): Flight information

        Returns:
            dict: Occupancy prediction
        """
        total_seats = sum(flight_data.get('totalSeats', {}).values())
        available_seats = sum(flight_data.get('availableSeats', {}).values())

        if total_seats == 0:
            return {'occupancyRate': 0, 'prediction': 'UNKNOWN'}

        current_occupancy = ((total_seats - available_seats) / total_seats) * 100

        # Predict final occupancy based on current rate and time factors
        departure_date = flight_data.get('departureTime', '')
        days_until = self._calculate_days_until(departure_date)

        # Apply time-based factor
        if days_until > 30:
            predicted_occupancy = current_occupancy + random.uniform(40, 60)
        elif days_until > 14:
            predicted_occupancy = current_occupancy + random.uniform(20, 40)
        elif days_until > 7:
            predicted_occupancy = current_occupancy + random.uniform(10, 25)
        else:
            predicted_occupancy = current_occupancy + random.uniform(5, 15)

        predicted_occupancy = min(predicted_occupancy, 100)

        # Categorize
        if predicted_occupancy >= 90:
            category = 'FULL'
            suggestion = 'Book immediately - likely to sell out'
        elif predicted_occupancy >= 70:
            category = 'HIGH'
            suggestion = 'Book soon - filling up fast'
        elif predicted_occupancy >= 40:
            category = 'MODERATE'
            suggestion = 'Good availability'
        else:
            category = 'LOW'
            suggestion = 'Plenty of seats available'

        return {
            'currentOccupancy': round(current_occupancy, 2),
            'predictedOccupancy': round(predicted_occupancy, 2),
            'category': category,
            'suggestion': suggestion,
            'availableSeats': available_seats
        }

    def get_best_time_to_book(self, route, travel_date):
        """
        Recommend best time to book for a route

        Args:
            route (dict): Route information
            travel_date (str): Planned travel date

        Returns:
            dict: Booking recommendation
        """
        try:
            travel_dt = datetime.fromisoformat(travel_date.replace('Z', '+00:00'))
            today = datetime.now()
            days_until = (travel_dt - today).days

            if days_until < 0:
                return {
                    'recommendation': 'BOOK_NOW',
                    'message': 'Travel date has passed',
                    'optimalDaysBeforeTravel': 0
                }

            # Optimal booking window: 3-8 weeks before travel
            optimal_min = 21  # 3 weeks
            optimal_max = 56  # 8 weeks

            if days_until < 7:
                recommendation = 'BOOK_NOW'
                message = 'Last minute - book immediately to secure seats'
            elif days_until < optimal_min:
                recommendation = 'BOOK_SOON'
                message = 'Within 3 weeks - book soon for better prices'
            elif optimal_min <= days_until <= optimal_max:
                recommendation = 'OPTIMAL_TIME'
                message = 'Perfect time to book - best balance of price and availability'
            else:
                recommendation = 'WAIT'
                message = f'Too early to book - wait {days_until - optimal_max} days'

            return {
                'recommendation': recommendation,
                'message': message,
                'daysUntilTravel': days_until,
                'optimalWindow': f'{optimal_min}-{optimal_max} days before travel'
            }

        except Exception as e:
            return {
                'recommendation': 'BOOK_NOW',
                'message': 'Unable to calculate optimal time',
                'error': str(e)
            }

    def _calculate_days_until(self, departure_date):
        """Calculate days until departure"""
        try:
            departure_dt = datetime.fromisoformat(departure_date.replace('Z', '+00:00'))
            today = datetime.now()
            return max((departure_dt - today).days, 0)
        except:
            return 30  # Default

    def _calculate_confidence(self, days_until_departure):
        """Calculate prediction confidence based on time until departure"""
        if days_until_departure > 60:
            return 0.6
        elif days_until_departure > 30:
            return 0.75
        elif days_until_departure > 14:
            return 0.85
        else:
            return 0.9

    def _get_season(self, date):
        """Determine season from date"""
        try:
            dt = datetime.fromisoformat(date.replace('Z', '+00:00'))
            month = dt.month

            if month in [12, 1, 2]:
                return 'winter'
            elif month in [3, 4, 5]:
                return 'spring'
            elif month in [6, 7, 8]:
                return 'summer'
            else:
                return 'autumn'
        except:
            return 'spring'  # Default
