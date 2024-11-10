class PromptTemplates:
    INITIAL_GREETING = """
    Hi! I'm here to help you create a professional resume. 
    Let's start with some basic information. What's your name and what type of role 
    are you looking for?
    """
    
    EXPERIENCE_PROMPT = """
    Tell me about your work experience. Include:
    - Your role/title
    - Company name
    - Duration
    - Key responsibilities and achievements
    Don't worry if you're just starting out - we can focus on projects, 
    internships, or academic experiences instead.
    """
    
    EDUCATION_PROMPT = """
    Let's talk about your education. Share details about:
    - Your degree/certification
    - Institution name
    - Graduation date (or expected)
    - Relevant coursework or achievements
    """
    
    SKILLS_PROMPT = """
    What skills would you like to highlight on your resume? Consider:
    - Technical skills
    - Soft skills
    - Tools and technologies
    - Languages
    - Certifications
    """
