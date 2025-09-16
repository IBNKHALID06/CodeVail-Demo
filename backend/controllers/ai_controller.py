from flask import Blueprint, request, jsonify
import os
from typing import Dict, Any, Optional
import json
import logging
import time

# Load environment variables early
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass

# Try to import AI providers, fallback gracefully if not available
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    OpenAI = None

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    import torch
    HUGGINGFACE_AVAILABLE = True
except ImportError:
    HUGGINGFACE_AVAILABLE = False
    pipeline = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ai_bp = Blueprint('ai', __name__)

# AI Configuration
class AIConfig:
    def __init__(self):
            # API Keys and Configuration (support both previous and new var names)
            self.openai_api_key = os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_KEY', '')
            self.gemini_api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY', '')
            self.huggingface_token = os.getenv('HUGGINGFACE_API_TOKEN') or os.getenv('HUGGINGFACE_TOKEN', '')

            # Model Configuration (prefer new naming from .env.example)
            self.preferred_provider = os.getenv('DEFAULT_AI_PROVIDER') or os.getenv('AI_PROVIDER', 'auto')  # auto, openai, gemini, huggingface
            self.openai_model = os.getenv('AI_MODEL_OPENAI') or os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
            self.gemini_model = os.getenv('AI_MODEL_GEMINI') or os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
            self.huggingface_model = os.getenv('AI_MODEL_HUGGINGFACE') or os.getenv('HUGGINGFACE_MODEL', 'microsoft/DialoGPT-small')

            # Generation Parameters
            self.max_tokens = int(os.getenv('AI_RESPONSE_MAX_TOKENS') or os.getenv('AI_MAX_TOKENS', '500'))
            self.temperature = float(os.getenv('AI_TEMPERATURE', '0.3'))
        
            # Initialize providers
            self.providers = {}
            self._initialize_providers()

            # Determine which providers are enabled
            self.enabled_providers = [name for name, provider in self.providers.items() if provider is not None]
            self.enabled = len(self.enabled_providers) > 0

            if self.enabled:
                logger.info(f"AI Assistant initialized with providers: {', '.join(self.enabled_providers)}")
            else:
                logger.warning("AI Assistant disabled - no providers available")

    def _initialize_providers(self):
        """Initialize all available AI providers"""
        
        # Initialize OpenAI
        if OPENAI_AVAILABLE and self.openai_api_key:
            try:
                self.providers['openai'] = OpenAI(api_key=self.openai_api_key)
                logger.info("OpenAI provider initialized")
            except Exception as e:
                logger.error(f"OpenAI initialization failed: {e}")
                self.providers['openai'] = None
        else:
            self.providers['openai'] = None
        
        # Initialize Gemini
        if GEMINI_AVAILABLE and self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.providers['gemini'] = genai.GenerativeModel(self.gemini_model)
                logger.info("Gemini provider initialized")
            except Exception as e:
                logger.error(f"Gemini initialization failed: {e}")
                self.providers['gemini'] = None
        else:
            self.providers['gemini'] = None
        
        # Initialize Hugging Face
        if HUGGINGFACE_AVAILABLE:
            try:
                model_name = self.huggingface_model or "microsoft/DialoGPT-small"
                self.providers['huggingface'] = {
                    'pipeline': pipeline(
                        "text-generation",
                        model=model_name,
                        device=0 if torch.cuda.is_available() else -1,
                        token=self.huggingface_token if self.huggingface_token else None
                    ),
                    'tokenizer': None,
                    'model_name': model_name
                }
                logger.info(f"Hugging Face provider initialized (model={model_name})")
            except Exception as e:
                logger.error(f"Hugging Face initialization failed: {e}")
                self.providers['huggingface'] = None
        else:
            self.providers['huggingface'] = None

    def get_available_provider(self, preferred=None):
        """Get the best available provider"""
        if preferred and preferred in self.providers and self.providers[preferred]:
            return preferred
        
        # Priority order: OpenAI -> Gemini -> Hugging Face
        for provider in ['openai', 'gemini', 'huggingface']:
            if self.providers.get(provider):
                return provider
        
        return None

ai_config = AIConfig()

# AI Assistant Service
class AIAssistantService:
    def __init__(self):
        self.session_history = {}
        
    def _generate_with_provider(self, provider: str, prompt: str, system_prompt: str = "") -> Optional[str]:
        """Generate text using specified provider"""
        try:
            if provider == 'openai':
                return self._generate_openai(prompt, system_prompt)
            elif provider == 'gemini':
                return self._generate_gemini(prompt, system_prompt)
            elif provider == 'huggingface':
                return self._generate_huggingface(prompt, system_prompt)
            else:
                return None
        except Exception as e:
            logger.error(f"Generation failed with {provider}: {e}")
            return None
    
    def _generate_openai(self, prompt: str, system_prompt: str = "") -> Optional[str]:
        """Generate text using OpenAI"""
        client = ai_config.providers['openai']
        if not client:
            return None
            
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = client.chat.completions.create(
            model=ai_config.openai_model,
            messages=messages,
            max_tokens=ai_config.max_tokens,
            temperature=ai_config.temperature
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_gemini(self, prompt: str, system_prompt: str = "") -> Optional[str]:
        """Generate text using Google Gemini"""
        model = ai_config.providers['gemini']
        if not model:
            return None
        
        # Combine system prompt and user prompt
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=ai_config.max_tokens,
            temperature=ai_config.temperature,
        )
        
        response = model.generate_content(
            full_prompt,
            generation_config=generation_config
        )
        
        return response.text.strip() if response.text else None
    
    def _generate_huggingface(self, prompt: str, system_prompt: str = "") -> Optional[str]:
        """Generate text using Hugging Face models"""
        hf_provider = ai_config.providers['huggingface']
        if not hf_provider:
            return None
        
        # Combine prompts for HuggingFace
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        # Limit prompt length for smaller models
        if len(full_prompt) > 200:
            full_prompt = full_prompt[-200:]
        
        response = hf_provider['pipeline'](
            full_prompt,
            max_length=min(len(full_prompt) + ai_config.max_tokens, 512),
            temperature=ai_config.temperature,
            do_sample=True,
            pad_token_id=50256
        )
        
        generated_text = response[0]['generated_text']
        # Extract only the new generated part
        new_text = generated_text[len(full_prompt):].strip()
        return new_text if new_text else generated_text.strip()
        
    def get_completion(self, prompt: str, context: str = "", language: str = "javascript", provider: str = None) -> Optional[str]:
        """Generate code completion suggestions"""
        if not ai_config.enabled:
            return self._get_mock_completion(language)
        
        # Determine which provider to use
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        if not selected_provider:
            return self._get_mock_completion(language)
            
        try:
            system_prompt = f"""You are a coding assistant helping with {language} programming. 
            Provide only the code completion/suggestion without explanations.
            Keep responses concise and relevant to the context."""
            
            user_prompt = f"""
            Language: {language}
            Context: {context}
            
            Complete this code:
            {prompt}
            """
            
            result = self._generate_with_provider(selected_provider, user_prompt, system_prompt)
            return result if result else self._get_mock_completion(language)
            
        except Exception as e:
            logger.error(f"AI completion error: {e}")
            return self._get_mock_completion(language)
    
    def analyze_code(self, code: str, language: str = "javascript", provider: str = None) -> Dict[str, Any]:
        """Analyze code for quality, issues, and suggestions"""
        if not ai_config.enabled:
            return self._get_mock_analysis()
        
        # Determine which provider to use
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        if not selected_provider:
            return self._get_mock_analysis()
            
        try:
            system_prompt = f"""You are a code reviewer. Analyze the {language} code and provide feedback in JSON format with these keys:
            - quality: Overall code quality assessment
            - suggestions: Improvement suggestions
            - issues: Potential problems or bugs
            - complexity: Code complexity level (low/medium/high)
            - performance: Performance considerations"""
            
            user_prompt = f"""
            Analyze this {language} code:
            ```{language}
            {code}
            ```
            
            Respond only with valid JSON.
            """
            
            result = self._generate_with_provider(selected_provider, user_prompt, system_prompt)
            
            if result:
                try:
                    return json.loads(result)
                except json.JSONDecodeError:
                    # If JSON parsing fails, create a structured response
                    return {
                        "quality": result[:100] + "..." if len(result) > 100 else result,
                        "suggestions": "See quality assessment for details",
                        "issues": "Manual review recommended",
                        "complexity": "unknown",
                        "performance": "Analysis provided above"
                    }
            else:
                return self._get_mock_analysis()
            
        except Exception as e:
            logger.error(f"AI analysis error: {e}")
            return self._get_mock_analysis()
    
    def get_hint(self, problem: str, current_code: str = "", language: str = "javascript", provider: str = None) -> Optional[str]:
        """Provide coding hints without giving away the solution"""
        if not ai_config.enabled:
            return self._get_mock_hint()
        
        # Determine which provider to use
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        if not selected_provider:
            return self._get_mock_hint()
            
        try:
            system_prompt = f"""You are a helpful coding tutor. Provide hints and guidance for {language} programming problems.
            Give hints that guide the student towards the solution without providing the complete answer.
            Be encouraging and educational."""
            
            user_prompt = f"""
            Problem: {problem}
            Current code: {current_code}
            Language: {language}
            
            Provide a helpful hint to guide the solution.
            """
            
            result = self._generate_with_provider(selected_provider, user_prompt, system_prompt)
            return result if result else self._get_mock_hint()
            
        except Exception as e:
            logger.error(f"AI hint error: {e}")
            return self._get_mock_hint()
    
    def explain_code(self, code: str, language: str = "javascript", provider: str = None) -> Optional[str]:
        """Explain what the code does"""
        if not ai_config.enabled:
            return self._get_mock_explanation()
        
        # Determine which provider to use
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        if not selected_provider:
            return self._get_mock_explanation()
            
        try:
            system_prompt = f"""You are a programming instructor. Explain {language} code clearly and concisely.
            Break down complex concepts and use simple language."""
            
            user_prompt = f"""
            Explain this {language} code:
            ```{language}
            {code}
            ```
            """
            
            result = self._generate_with_provider(selected_provider, user_prompt, system_prompt)
            return result if result else self._get_mock_explanation()
            
        except Exception as e:
            logger.error(f"AI explanation error: {e}")
            return self._get_mock_explanation()
    
    def _get_mock_completion(self, language: str) -> str:
        """Mock completion for when AI is disabled"""
        mock_completions = {
            "javascript": "// AI assistant is currently unavailable\nconsole.log('Continue coding!');",
            "python": "# AI assistant is currently unavailable\nprint('Continue coding!')",
            "java": "// AI assistant is currently unavailable\nSystem.out.println(\"Continue coding!\");",
            "cpp": "// AI assistant is currently unavailable\nstd::cout << \"Continue coding!\" << std::endl;",
            "csharp": "// AI assistant is currently unavailable\nConsole.WriteLine(\"Continue coding!\");"
        }
        return mock_completions.get(language.lower(), "// AI assistant is currently unavailable")
    
    def _get_mock_analysis(self) -> Dict[str, Any]:
        """Mock analysis for when AI is disabled"""
        return {
            "quality": "AI analysis is currently unavailable. Please check your code manually.",
            "suggestions": "Enable AI assistant to get personalized suggestions.",
            "issues": "No automated analysis available at this time.",
            "complexity": "unknown",
            "performance": "Manual review recommended."
        }
    
    def _get_mock_hint(self) -> str:
        """Mock hint for when AI is disabled"""
        return "AI assistant is currently unavailable. Try breaking down the problem into smaller steps and think about the algorithm you need to implement."
    
    def _get_mock_explanation(self) -> str:
        """Mock explanation for when AI is disabled"""
        return "AI assistant is currently unavailable. Try reading the code line by line and identifying what each part does."

# Initialize the service
ai_service = AIAssistantService()

@ai_bp.route('/status', methods=['GET'])
def get_ai_status():
    """Get AI assistant status"""
    return jsonify({
        'enabled': ai_config.enabled,
        'providers': {
            'openai': {
                'available': ai_config.providers.get('openai') is not None,
                'model': ai_config.openai_model if ai_config.providers.get('openai') else None
            },
            'gemini': {
                'available': ai_config.providers.get('gemini') is not None,
                'model': ai_config.gemini_model if ai_config.providers.get('gemini') else None
            },
            'huggingface': {
                'available': ai_config.providers.get('huggingface') is not None,
                'model': ai_config.huggingface_model if ai_config.providers.get('huggingface') else None
            }
        },
        'enabled_providers': ai_config.enabled_providers,
        'preferred_provider': ai_config.preferred_provider,
        'status': 'online' if ai_config.enabled else 'offline'
    })

@ai_bp.route('/providers', methods=['GET'])
def get_providers():
    """Get available AI providers"""
    return jsonify({
        'available_providers': ai_config.enabled_providers,
        'provider_details': {
            provider: {
                'available': ai_config.providers.get(provider) is not None,
                'model': getattr(ai_config, f'{provider}_model', 'unknown')
            } for provider in ['openai', 'gemini', 'huggingface']
        }
    })

@ai_bp.route('/completion', methods=['POST'])
def get_code_completion():
    """Get code completion suggestions"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'javascript')
        context = data.get('context', '')
        provider = data.get('provider', None)  # Allow provider selection
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        completion = ai_service.get_completion(code, context, language, provider)
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        
        return jsonify({
            'completion': completion,
            'language': language,
            'provider_used': selected_provider,
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Completion endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ai_bp.route('/analyze', methods=['POST'])
def analyze_code():
    """Analyze code quality and provide feedback"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'javascript')
        provider = data.get('provider', None)
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        analysis = ai_service.analyze_code(code, language, provider)
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        
        return jsonify({
            'analysis': analysis,
            'language': language,
            'provider_used': selected_provider,
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Analysis endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ai_bp.route('/hint', methods=['POST'])
def get_hint():
    """Get coding hints for a problem"""
    try:
        data = request.get_json()
        problem = data.get('problem', '')
        current_code = data.get('current_code', '')
        language = data.get('language', 'javascript')
        provider = data.get('provider', None)
        
        if not problem:
            return jsonify({'error': 'Problem description is required'}), 400
        
        hint = ai_service.get_hint(problem, current_code, language, provider)
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        
        return jsonify({
            'hint': hint,
            'language': language,
            'provider_used': selected_provider,
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Hint endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ai_bp.route('/explain', methods=['POST'])
def explain_code():
    """Explain what the code does"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'javascript')
        provider = data.get('provider', None)
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        explanation = ai_service.explain_code(code, language, provider)
        selected_provider = ai_config.get_available_provider(provider or ai_config.preferred_provider)
        
        return jsonify({
            'explanation': explanation,
            'language': language,
            'provider_used': selected_provider,
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Explanation endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ai_bp.route('/session', methods=['POST'])
def create_session():
    """Create a new AI session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', f"session_{int(time.time())}")
        
        ai_service.session_history[session_id] = {
            'created_at': time.time(),
            'interactions': [],
            'context': {}
        }
        
        return jsonify({
            'session_id': session_id,
            'status': 'created'
        })
        
    except Exception as e:
        logger.error(f"Session creation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ai_bp.route('/session/<session_id>/history', methods=['GET'])
def get_session_history(session_id):
    """Get session interaction history"""
    try:
        if session_id not in ai_service.session_history:
            return jsonify({'error': 'Session not found'}), 404
        
        return jsonify({
            'session_id': session_id,
            'history': ai_service.session_history[session_id]
        })
        
    except Exception as e:
        logger.error(f"Session history error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Health check endpoint
@ai_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for AI service"""
    return jsonify({
        'status': 'healthy',
        'ai_enabled': ai_config.enabled,
        'timestamp': time.time()
    })
