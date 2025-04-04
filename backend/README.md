
# Healthcare Bot Python Backend

This is the Python backend for the Healthcare Bot application. It provides API endpoints for the React frontend.

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

The server will start on http://localhost:5000

## API Endpoints

- `GET/POST /api/user` - Get or update user data
- `GET/POST /api/appointments` - Get all appointments or create a new appointment
- `DELETE /api/appointments/<id>` - Delete an appointment
- `GET/POST /api/feedback` - Get all feedback or submit new feedback
- `GET/POST/DELETE /api/chat-history` - Get, add to, or clear chat history

## Data Storage

All data is stored in JSON files in the `data` directory. In a production application, you should use a proper database.
