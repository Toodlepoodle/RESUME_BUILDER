import requests
import json
from config import Config

class ResumeGenerator:
    def __init__(self):
        self.api_key = Config.GROQ_API_KEY
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def generate_resume(self, user_data):
        """
        Generate a resume using the LLaMA model via Groq's API
        """
        prompt = self._build_prompt(user_data)
        
        payload = {
            "model": "llama3-70b-8192",  # Using LLaMA 3 70B model
            "messages": [
                {"role": "system", "content": "You are an expert resume writer with years of experience. Your task is to create a professional resume based on the information provided."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 4000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            resume_content = result["choices"][0]["message"]["content"]
            
            # Parse the resume content and structure it
            return self._structure_resume(resume_content)
            
        except Exception as e:
            print(f"Error generating resume: {str(e)}")
            return {"error": str(e)}
    
    def _build_prompt(self, user_data):
        """
        Build a detailed prompt based on user data
        """
        prompt = f"""
        Create a professional resume for someone with the following details:

        Personal Information:
        - Name: {user_data.get('name', '')}
        - Email: {user_data.get('email', '')}
        - Phone: {user_data.get('phone', '')}
        - Location: {user_data.get('location', '')}
        - LinkedIn (if provided): {user_data.get('linkedin', 'Not provided')}

        Professional Summary:
        {user_data.get('summary', '')}

        Education:
        {user_data.get('education', '')}

        Work Experience:
        {user_data.get('experience', '')}

        Skills:
        {user_data.get('skills', '')}

        Additional Information:
        - Target Role: {user_data.get('target_role', '')}
        - Industry: {user_data.get('industry', '')}
        - Years of Experience: {user_data.get('years_of_experience', '')}

        Please create a professional, ATS-friendly resume in markdown format with the following sections:
        1. Header (Name and Contact Information)
        2. Professional Summary (compelling but concise)
        3. Skills (relevant to the target role, prioritize technical and in-demand skills)
        4. Work Experience (with accomplishment-focused bullet points using strong action verbs)
        5. Education
        6. Optional: Certifications, Projects, or Additional sections if relevant

        Format the work experience bullets as accomplished-focused statements using the format: "Accomplished [X] as measured by [Y] by doing [Z]" where possible.
        Optimize the resume for ATS systems by incorporating relevant keywords from the target role.
        """
        return prompt
    
    def _structure_resume(self, content):
        """
        Structure the raw resume content into sections
        """
        # Basic parsing of markdown sections
        sections = {
            "header": "",
            "summary": "",
            "skills": "",
            "experience": "",
            "education": "",
            "additional": ""
        }
        
        current_section = "header"
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if not line:
                continue
                
            if line.startswith('# ') or line.startswith('## '):
                lower_line = line.lower()
                if 'summary' in lower_line or 'profile' in lower_line:
                    current_section = "summary"
                elif 'skill' in lower_line:
                    current_section = "skills"
                elif 'experience' in lower_line or 'work' in lower_line:
                    current_section = "experience"
                elif 'education' in lower_line:
                    current_section = "education"
                elif 'certification' in lower_line or 'project' in lower_line or 'additional' in lower_line:
                    current_section = "additional"
                else:
                    current_section = "header"
            else:
                sections[current_section] += line + '\n'
        
        return {
            "content": content,
            "sections": sections
        }