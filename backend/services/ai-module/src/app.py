"""
AI Module Flask Application
REST API for flight recommendations and demand prediction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from recommendation_engine import RecommendationEngine
from demand_predictor import DemandPredictor

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize AI modules
recommendation_engine = RecommendationEngine()
demand_predictor = DemandPredictor()

# Service configuration
SERVICE_NAME = 'AI-MODULE'
PORT = int(os.getenv('PORT', 5004))


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'service': SERVICE_NAME,
        'status': 'running',
        'version': '1.0.0'
    }), 200


@app.route('/api/ai/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get flight recommendations based on user preferences

    POST Body:
    {
        "userPreferences": {
            "pricePreference": "LOW|MEDIUM|COMFORT",
            "timePreference": "MORNING|AFTERNOON|EVENING",
            "seatPreference": "WINDOW|AISLE|MIDDLE"
        },
        "flights": [...]
    }
    """
    try:
        data = request.get_json()
        user_preferences = data.get('userPreferences', {})
        flights = data.get('flights', [])

        if not flights:
            return jsonify({
                'success': False,
                'message': 'No flights provided for recommendation'
            }), 400

        recommendations = recommendation_engine.recommend_flights(
            user_preferences,
            flights
        )

        return jsonify({
            'success': True,
            'count': len(recommendations),
            'data': recommendations
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Recommendation failed',
            'error': str(e)
        }), 500


@app.route('/api/ai/demand/predict', methods=['POST'])
def predict_demand():
    """
    Predict demand for a specific route and date

    POST Body:
    {
        "route": {
            "origin": "DEL",
            "destination": "BOM"
        },
        "date": "2024-06-15"
    }
    """
    try:
        data = request.get_json()
        route = data.get('route', {})
        date = data.get('date', '')

        if not route or not date:
            return jsonify({
                'success': False,
                'message': 'Route and date are required'
            }), 400

        prediction = recommendation_engine.predict_demand(route, date)

        return jsonify({
            'success': True,
            'data': prediction
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Demand prediction failed',
            'error': str(e)
        }), 500


@app.route('/api/ai/price/predict', methods=['POST'])
def predict_price():
    """
    Predict price trend for a flight

    POST Body:
    {
        "route": {...},
        "currentPrice": 5000,
        "daysUntilDeparture": 15
    }
    """
    try:
        data = request.get_json()
        route = data.get('route', {})
        current_price = data.get('currentPrice', 0)
        days_until = data.get('daysUntilDeparture', 30)

        prediction = demand_predictor.predict_price_trend(
            route,
            current_price,
            days_until
        )

        return jsonify({
            'success': True,
            'data': prediction
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Price prediction failed',
            'error': str(e)
        }), 500


@app.route('/api/ai/occupancy/predict', methods=['POST'])
def predict_occupancy():
    """
    Predict flight occupancy

    POST Body:
    {
        "flightData": {
            "totalSeats": {...},
            "availableSeats": {...},
            "departureTime": "2024-06-15T10:00:00Z"
        }
    }
    """
    try:
        data = request.get_json()
        flight_data = data.get('flightData', {})

        prediction = demand_predictor.predict_occupancy(flight_data)

        return jsonify({
            'success': True,
            'data': prediction
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Occupancy prediction failed',
            'error': str(e)
        }), 500


@app.route('/api/ai/booking-time', methods=['POST'])
def best_booking_time():
    """
    Get best time to book recommendation

    POST Body:
    {
        "route": {...},
        "travelDate": "2024-06-15"
    }
    """
    try:
        data = request.get_json()
        route = data.get('route', {})
        travel_date = data.get('travelDate', '')

        recommendation = demand_predictor.get_best_time_to_book(route, travel_date)

        return jsonify({
            'success': True,
            'data': recommendation
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Booking time recommendation failed',
            'error': str(e)
        }), 500


@app.route('/api/ai/popular-destinations', methods=['GET'])
def popular_destinations():
    """
    Get popular destinations

    Query Parameters:
    - origin (optional): Origin airport code
    """
    try:
        origin = request.args.get('origin', None)

        destinations = recommendation_engine.get_popular_destinations(origin)

        return jsonify({
            'success': True,
            'count': len(destinations),
            'data': destinations
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch popular destinations',
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500


if __name__ == '__main__':
    print(f'\n✅ {SERVICE_NAME} starting on port {PORT}...')
    print(f'📊 Recommendation Engine: Ready')
    print(f'🔮 Demand Predictor: Ready\n')

    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=(os.getenv('FLASK_ENV') == 'development')
    )
