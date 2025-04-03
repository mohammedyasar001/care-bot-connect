
// Health response data for the bot
export const healthResponses: Record<string, string> = {
  "hello": "Hello! I am a Health Care Bot. How can I assist you today?",
  "hi": "Hi there! I'm here to help with your health-related questions. What do you need?",
  "how are you": "I'm just a bot, but I'm here to help you with your health concerns!",
  "what is your name": "I am a Health Care Bot. You can call me HealthBot!",
  "headache": "Headaches can be caused by stress, dehydration, or other factors. Prescription: Drink water, rest, and take pain relievers like Paracetamol. Consult a doctor if it persists.",
  "dizziness": "Dizziness can be caused by low blood sugar, dehydration, or inner ear issues. Prescription: Sit down, drink water, and eat something sweet. Consult a doctor if it continues.",
  "rash": "Skin rashes can be caused by allergies, infections, or skin conditions. Prescription: Apply hydrocortisone cream and avoid irritants. Consult a dermatologist for a proper diagnosis.",
  "ibuprofen side effects": "Common side effects of ibuprofen include stomach upset, nausea, and headache. Prescription: Always consult a doctor before taking any medication.",
  "prevent flu": "To prevent the flu, practice good hygiene, get vaccinated, and maintain a healthy lifestyle. Prescription: Wash hands frequently and avoid close contact with sick individuals.",
  "balanced diet": "A balanced diet includes fruits, vegetables, lean proteins, and whole grains. Prescription: Consult a dietitian for a personalized plan.",
  "lower back pain": "Gentle stretching, yoga, and core-strengthening exercises can help with lower back pain. Prescription: Use pain relievers like Ibuprofen and consult a physiotherapist for guidance.",
  "stress": "Stress can be managed through deep breathing, exercise, and talking to a mental health professional. Prescription: Practice mindfulness and consider therapy if needed.",
  "fever": "A fever is often a sign of infection. Prescription: Rest, stay hydrated, and take Paracetamol. Consult a doctor if the fever is high or persists.",
  "cough": "A cough can be caused by colds, allergies, or infections. Prescription: Stay hydrated and use cough syrup. Consult a doctor if it lasts more than a week.",
  "sore throat": "A sore throat can be caused by infections or allergies. Prescription: Gargle with warm salt water and take throat lozenges. Consult a doctor if it persists.",
  "thank you": "You're welcome! Let me know if you have more health-related questions.",
  "bye": "Goodbye! Take care and stay healthy!",
  "schedule appointment": "To schedule an appointment, click the 'Schedule Appointment' button in the sidebar.",
  "diabetes": "Diabetes is a chronic condition where the body cannot regulate blood sugar levels. Prescription: Monitor blood sugar regularly, follow a low-sugar diet, and take prescribed medications like Metformin or Insulin.",
  "hypertension": "Hypertension (high blood pressure) can lead to heart disease and stroke. Prescription: Reduce salt intake, exercise regularly, and take medications like Lisinopril or Amlodipine as prescribed.",
  "asthma": "Asthma is a condition where airways become inflamed and narrow, causing breathing difficulties. Prescription: Use inhalers like Albuterol for quick relief and corticosteroids for long-term control. Avoid triggers like smoke and allergens.",
  "migraine": "Migraines are severe headaches often accompanied by nausea and sensitivity to light. Prescription: Take medications like Sumatriptan or Ibuprofen. Rest in a dark, quiet room and stay hydrated.",
  "arthritis": "Arthritis causes joint pain and stiffness, often due to inflammation. Prescription: Use anti-inflammatory medications like Ibuprofen or Naproxen. Physical therapy and regular exercise can help.",
  "common cold": "The common cold is a viral infection affecting the nose and throat. Prescription: Rest, stay hydrated, and take over-the-counter medications like Paracetamol for fever and pain."
};

// Emergency contacts
export const emergencyContacts = {
  "Ambulance": "102",
  "Police": "100",
  "Fire Brigade": "101",
  "Poison Control": "1800-222-1222"
};

// Health tips
export const healthTips = [
  "Drink at least 8 glasses of water daily to stay hydrated.",
  "Aim for at least 30 minutes of moderate exercise daily.",
  "Include fruits and vegetables in every meal.",
  "Get 7-8 hours of sleep each night for better health.",
  "Practice deep breathing to reduce stress.",
  "Take short breaks from screen time to rest your eyes.",
  "Maintain good posture to prevent back and neck pain.",
  "Wash your hands regularly to prevent infections.",
  "Schedule regular check-ups with your healthcare provider.",
  "Stay up to date with vaccinations.",
  "Limit processed foods and added sugars in your diet.",
  "Practice mindfulness or meditation for mental well-being."
];

// Fuzzy match user input to a predefined response
export const getBotResponse = (userText: string): string => {
  // Convert to lowercase for case-insensitive matching
  const normalizedText = userText.toLowerCase();
  
  // Check for exact matches first
  if (healthResponses[normalizedText]) {
    return healthResponses[normalizedText];
  }
  
  // Simple fuzzy matching - check if the input contains any of our keywords
  for (const [key, response] of Object.entries(healthResponses)) {
    if (normalizedText.includes(key)) {
      return response;
    }
  }
  
  // Check for partial matches
  for (const [key, response] of Object.entries(healthResponses)) {
    // If 3+ characters and is contained in the key
    if (key.length >= 3 && key.includes(normalizedText) && normalizedText.length >= 3) {
      return response;
    }
  }
  
  // No match found
  return "I'm sorry, I didn't understand that. Can you please rephrase your question or concern?";
};

// Get a random health tip
export const getRandomHealthTip = (): string => {
  const randomIndex = Math.floor(Math.random() * healthTips.length);
  return healthTips[randomIndex];
};
