from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.ai_resume_generator import ResumeGenerator
from config import Config
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

resume_generator = ResumeGenerator()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Generate resume using AI
        result = resume_generator.generate_resume(data)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export-pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.json
        if not data or 'content' not in data:
            return jsonify({"error": "No resume content provided"}), 400
        
        # In a real application, you'd use a PDF generation library here
        # For now, we'll just return a success message
        return jsonify({"message": "PDF export functionality will be implemented here"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )