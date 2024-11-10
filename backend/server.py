from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq
from config.config import Config

app = Flask(__name__)
CORS(app)

# Initialize Groq client with API key
if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = Config.GROQ_API_KEY

groq_client = Groq()

@app.route('/')
def index():
    """Root endpoint (/)"""
    return jsonify({
        "message": "Welcome to the Resume Builder API! Use /api/chat and /api/generate-resume endpoints to interact."
    })

def create_chat_prompt(previous_responses, current_question):
    """Create a contextual chat prompt based on previous responses"""
    conversation_history = "\n".join([f"Q: {q}\nA: {a}" for q, a in previous_responses.items()])
    
    return f"""
    Previous conversation:
    {conversation_history}

    Based on this conversation, {current_question}
    Please provide a natural, conversational response that helps gather more information for the resume.
    """

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handles the chat conversation between the user and the system"""
    data = request.json
    previous_responses = data.get('previousResponses', {})
    current_question = data.get('currentQuestion', '')

    try:
        completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional career counselor helping students create their resumes. Be friendly, encouraging, and ask follow-up questions to get more detailed information when needed."
                },
                {
                    "role": "user",
                    "content": create_chat_prompt(previous_responses, current_question)
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=2000
        )

        return jsonify({
            "response": completion.choices[0].message.content,
            "follow_up": determine_follow_up(completion.choices[0].message.content)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    """Generates a professional resume based on conversation history"""
    data = request.json

    prompt = f"""
    Create a professional resume based on the following conversation history:

    {format_conversation_history(data.get('conversationHistory', []))}

    Please create a modern, well-structured resume that highlights the candidate's strengths.
    The resume should include:
    1. A compelling professional summary
    2. Relevant work experience with accomplishments
    3. Education details
    4. Skills and technical competencies
    5. Any relevant projects or achievements

    Return the resume as a JSON object with the following structure:
    {{
        "sections": [
            {{
                "type": "header",
                "content": {{ "name": "", "contact": {{ "email": "", "phone": "", "location": "" }} }}
            }},
            {{
                "type": "summary",
                "content": ""
            }},
            {{
                "type": "experience",
                "content": [
                    {{
                        "title": "",
                        "company": "",
                        "duration": "",
                        "location": "",
                        "achievements": []
                    }}
                ]
            }},
            {{
                "type": "education",
                "content": [
                    {{
                        "degree": "",
                        "institution": "",
                        "duration": "",
                        "location": "",
                        "details": []
                    }}
                ]
            }},
            {{
                "type": "skills",
                "content": {{
                    "technical": [],
                    "soft": []
                }}
            }}
        ]
    }}
    """

    try:
        completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional resume writer specializing in creating compelling resumes for students and recent graduates."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.3,
            max_tokens=4000
        )

        return jsonify(completion.choices[0].message.content)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def format_conversation_history(history):
    """Format the conversation history for the AI prompt"""
    formatted = []
    for entry in history:
        formatted.append(f"Human: {entry['question']}")
        formatted.append(f"Answer: {entry['response']}")
    return "\n".join(formatted)

def determine_follow_up(ai_response):
    """Analyze AI response to determine if follow-up is needed"""
    # Add logic to detect if the AI is asking a follow-up question
    return "?" in ai_response

if __name__ == '__main__':
    app.run(debug=Config.DEBUG)
