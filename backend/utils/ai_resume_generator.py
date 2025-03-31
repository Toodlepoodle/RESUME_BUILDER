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
                {"role": "system", "content": "You are an expert resume writer with years of experience. Your task is to create a professional resume based on the information provided, following the template style specified, and optimizing for the target role."},
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
            return self._structure_resume(resume_content, user_data.get('template', 'modern'))
            
        except Exception as e:
            print(f"Error generating resume: {str(e)}")
            return {"error": str(e)}
    
    def _build_prompt(self, user_data):
        """
        Build a detailed prompt based on user data and selected template
        """
        # Extract job description for tailoring
        job_description = user_data.get('job_description', '')
        job_tailoring = ""
        if job_description:
            job_tailoring = f"""
            Job Description to tailor this resume for:
            {job_description}
            
            When crafting this resume, focus on highlighting skills, experiences, and accomplishments that align with this job description. 
            Incorporate relevant keywords from the job description throughout the resume.
            """
        
        template = user_data.get('template', 'modern')
        template_instructions = self._get_template_instructions(template)
        
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
        
        {job_tailoring}

        Template Style: {template}
        {template_instructions}

        Please create a professional, ATS-friendly resume in markdown format with the following sections:
        1. Header (Name and Contact Information)
        2. Professional Summary (compelling but concise)
        3. Skills (relevant to the target role, prioritize technical and in-demand skills)
        4. Work Experience (with accomplishment-focused bullet points using strong action verbs)
        5. Education
        6. Optional: Certifications, Projects, or Additional sections if relevant

        Format the work experience bullets as accomplished-focused statements using the format: "Accomplished [X] as measured by [Y] by doing [Z]" where possible.
        Optimize the resume for ATS systems by incorporating relevant keywords from the target role.
        
        The markdown should be properly formatted for the selected template style.
        """
        return prompt
    
    def _get_template_instructions(self, template):
        """
        Get specific formatting instructions based on template choice
        """
        templates = {
            "modern": """
                Use a clean, contemporary design with minimal formatting:
                - Use ## for main section headers (Skills, Experience, etc.)
                - Use ### for sub-headers (company names, degree names)
                - Use bullet points (- ) for listing skills and achievements
                - Keep formatting minimal but use **bold** for emphasis on key points
                - Include a horizontal rule (---) between major sections
            """,
            "classic": """
                Use a traditional, formal design suitable for conservative industries:
                - Use ## for ALL CAPS section headers (SKILLS, EXPERIENCE, etc.)
                - Use ### for sub-headers with position titles on first line, organization on second
                - Use bullet points (- ) with formal, complete sentence structure
                - Minimal use of formatting, maintain professional tone throughout
                - Use horizontal rules (---) to separate each section
            """,
            "creative": """
                Use a distinctive design that showcases personality while remaining professional:
                - Use ## for uniquely styled section headers (e.g., "✨ Skills & Expertise")
                - Use ### for sub-headers with creative formatting
                - Use bullet points with symbols (e.g., "→ " or "★ ") for achievements
                - Incorporate **bold** and *italic* formatting more liberally
                - Add brief personal tagline or motto under the name in the header
            """,
            "executive": """
                Use a sophisticated, leadership-focused design:
                - Begin with an "Executive Profile" instead of summary
                - Use ## for concise section headers
                - Use ### for organization names first, followed by titles
                - Use bullet points that emphasize leadership, strategic initiatives, and results
                - Include "Core Competencies" section with 6-8 key leadership skills
                - Mention board positions, speaking engagements, or publications if applicable
            """
        }
        
        return templates.get(template, templates["modern"])
    
    def _structure_resume(self, content, template):
        """
        Structure the raw resume content into sections and add template metadata
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
                elif 'skill' in lower_line or 'competenc' in lower_line:
                    current_section = "skills"
                elif 'experience' in lower_line or 'work' in lower_line or 'career' in lower_line:
                    current_section = "experience"
                elif 'education' in lower_line:
                    current_section = "education"
                elif any(term in lower_line for term in ['certification', 'project', 'additional', 'volunteer', 'publication']):
                    current_section = "additional"
                else:
                    # If it's a header but doesn't match known sections, keep it in header
                    current_section = "header"
            else:
                sections[current_section] += line + '\n'
        
        return {
            "content": content,
            "sections": sections,
            "template": template
        }