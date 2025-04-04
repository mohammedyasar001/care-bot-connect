
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import random
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize data storage (in a real app, you'd use a database)
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# Data file paths
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
APPOINTMENTS_FILE = os.path.join(DATA_DIR, 'appointments.json')
FEEDBACK_FILE = os.path.join(DATA_DIR, 'feedback.json')
CHAT_HISTORY_FILE = os.path.join(DATA_DIR, 'chat_history.json')

# Health data from the original JavaScript
EMERGENCY_CONTACTS = {
    "Emergency": "911",
    "Poison Control": "1-800-222-1222",
    "Mental Health Crisis": "988",
    "Nurse Helpline": "1-800-874-2273"
}

HEALTH_TIPS = [
    "Stay hydrated by drinking at least 8 glasses of water daily.",
    "Aim for 7-9 hours of sleep each night for optimal health.",
    "Regular physical activity can improve your mood and reduce anxiety.",
    "Incorporate fruits and vegetables in each meal for essential nutrients.",
    "Practice mindfulness meditation to reduce stress levels.",
    "Limit screen time before bed to improve sleep quality.",
    "Regular health check-ups can help detect issues early.",
    "Wash hands frequently to prevent the spread of germs.",
    "Maintain good posture to prevent back and neck pain.",
    "Stay up to date with vaccinations to prevent serious illnesses."
]

SYMPTOM_RESPONSES = {
    "headache": "Headaches can be caused by stress, dehydration, or eye strain. Try drinking water, resting in a dark room, and over-the-counter pain relievers if needed.",
    "fever": "Fever is your body's way of fighting infection. Rest, stay hydrated, and take acetaminophen if temperature exceeds 100.4°F (38°C). Seek medical attention if fever persists over 3 days.",
    "cough": "For dry coughs, try honey (if over 1 year old) and staying hydrated. For productive coughs, use a humidifier and consider over-the-counter expectorants. Seek care if coughing blood or having difficulty breathing.",
    "sore throat": "Gargle with warm salt water, use throat lozenges, and drink warm liquids. If accompanied by high fever or difficulty swallowing, consult a healthcare provider.",
    "cold": "Rest, drink plenty of fluids, and consider over-the-counter cold medications. Cold symptoms typically resolve within 7-10 days.",
    "flu": "Rest, stay hydrated, and take acetaminophen for fever. Contact your doctor if symptoms are severe, as antiviral medications may be prescribed if caught early.",
    "allergies": "Avoid known triggers, use over-the-counter antihistamines, and consider nasal steroids for persistent symptoms. Consult with an allergist for severe or chronic allergies.",
    "stomach ache": "Try sipping clear fluids, eating bland foods, and avoiding dairy and spicy items. If pain is severe or accompanied by fever, seek medical attention.",
    "diarrhea": "Stay hydrated with water and electrolyte solutions. Follow the BRAT diet (bananas, rice, applesauce, toast). Seek care if symptoms persist beyond 2 days or are accompanied by severe pain or blood.",
    "insomnia": "Establish a regular sleep schedule, create a relaxing bedtime routine, limit screen time before bed, and avoid caffeine in the afternoons and evenings."
}

# Helper functions to read/write JSON data
def read_json_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return []

def write_json_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f)

# Initialize data files if they don't exist
if not os.path.exists(USERS_FILE):
    write_json_file(USERS_FILE, {})
if not os.path.exists(APPOINTMENTS_FILE):
    write_json_file(APPOINTMENTS_FILE, [])
if not os.path.exists(FEEDBACK_FILE):
    write_json_file(FEEDBACK_FILE, [])
if not os.path.exists(CHAT_HISTORY_FILE):
    welcome_message = {
        "id": str(int(time.time() * 1000)),
        "sender": "HealthCare Bot",
        "message": "Welcome to HealthCare Bot! How can I assist you today?",
        "timestamp": datetime.now().isoformat()
    }
    write_json_file(CHAT_HISTORY_FILE, [welcome_message])

# Bot response generation
def get_bot_response(message):
    message_lower = message.lower()
    
    # Check for specific symptoms
    for symptom, response in SYMPTOM_RESPONSES.items():
        if symptom in message_lower:
            return response
    
    # Check for special commands
    if "emergency" in message_lower:
        return "Emergency contacts:\n" + "\n".join([f"{k}: {v}" for k, v in EMERGENCY_CONTACTS.items()])
    
    elif "health tip" in message_lower:
        return random.choice(HEALTH_TIPS)
    
    elif "appointment" in message_lower:
        return "To schedule an appointment, please use the appointment scheduler in the sidebar."
    
    elif "hello" in message_lower or "hi" in message_lower:
        return "Hello! How can I assist you with your health questions today?"
    
    # Generic responses
    generic_responses = [
        "I understand your concern. Could you provide more details about your symptoms?",
        "That's something you should discuss with your healthcare provider. Would you like to schedule an appointment?",
        "I recommend maintaining a balanced diet and regular exercise routine to support overall health.",
        "It's important to get adequate rest when dealing with health issues. How are your sleep habits?",
        "I'm here to provide general health information, but remember I cannot replace professional medical advice."
    ]
    
    return random.choice(generic_responses)

# API Routes

@app.route('/api/user', methods=['GET', 'POST'])
def handle_user():
    if request.method == 'GET':
        user_data = read_json_file(USERS_FILE)
        return jsonify(user_data)
    
    elif request.method == 'POST':
        user_data = request.json
        write_json_file(USERS_FILE, user_data)
        return jsonify({"status": "success", "message": "User data saved"})

@app.route('/api/appointments', methods=['GET', 'POST'])
def handle_appointments():
    if request.method == 'GET':
        appointments = read_json_file(APPOINTMENTS_FILE)
        return jsonify(appointments)
    
    elif request.method == 'POST':
        appointment = request.json
        appointments = read_json_file(APPOINTMENTS_FILE)
        # Add ID and reminded flag
        appointment['id'] = int(time.time() * 1000)
        appointment['reminded'] = False
        appointments.append(appointment)
        write_json_file(APPOINTMENTS_FILE, appointments)
        return jsonify(appointment)

@app.route('/api/appointments/<int:app_id>', methods=['DELETE'])
def delete_appointment(app_id):
    appointments = read_json_file(APPOINTMENTS_FILE)
    updated_appointments = [app for app in appointments if app['id'] != app_id]
    write_json_file(APPOINTMENTS_FILE, updated_appointments)
    return jsonify({"status": "success", "message": f"Appointment {app_id} deleted"})

@app.route('/api/feedback', methods=['GET', 'POST'])
def handle_feedback():
    if request.method == 'GET':
        feedback = read_json_file(FEEDBACK_FILE)
        return jsonify(feedback)
    
    elif request.method == 'POST':
        feedback_data = request.json
        feedback_list = read_json_file(FEEDBACK_FILE)
        feedback_data['id'] = int(time.time() * 1000)
        feedback_list.append(feedback_data)
        write_json_file(FEEDBACK_FILE, feedback_list)
        return jsonify({"status": "success", "message": "Feedback saved"})

@app.route('/api/chat-history', methods=['GET', 'POST', 'DELETE'])
def handle_chat_history():
    if request.method == 'GET':
        chat_history = read_json_file(CHAT_HISTORY_FILE)
        return jsonify(chat_history)
    
    elif request.method == 'POST':
        chat_history = read_json_file(CHAT_HISTORY_FILE)
        message = request.json.get('message', '')
        sender = request.json.get('sender', 'You')
        
        # Add user message
        new_message = {
            "id": str(int(time.time() * 1000)),
            "sender": sender,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        chat_history.append(new_message)
        
        # Add bot response if the sender is 'You'
        if sender == 'You':
            bot_response = get_bot_response(message)
            bot_message = {
                "id": str(int(time.time() * 1000) + 1),
                "sender": "HealthCare Bot",
                "message": bot_response,
                "timestamp": datetime.now().isoformat()
            }
            chat_history.append(bot_message)
        
        # Keep only the last 50 messages
        chat_history = chat_history[-50:]
        write_json_file(CHAT_HISTORY_FILE, chat_history)
        
        return jsonify(new_message if sender != 'You' else [new_message, bot_message])
    
    elif request.method == 'DELETE':
        welcome_message = {
            "id": str(int(time.time() * 1000)),
            "sender": "HealthCare Bot",
            "message": "Chat history cleared. How can I help you today?",
            "timestamp": datetime.now().isoformat()
        }
        write_json_file(CHAT_HISTORY_FILE, [welcome_message])
        return jsonify({"status": "success", "message": "Chat history cleared"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
