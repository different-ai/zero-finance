import os
from pathlib import Path
from dotenv import load_dotenv

def load_environment():
    """Load environment variables from .env files in order of precedence."""
    env_files = ['.env.local', '.env', '.env.example']
    
    for env_file in env_files:
        env_path = Path(env_file)
        if env_path.exists():
            load_dotenv(dotenv_path=env_path, override=True)

def create_llm_client(provider="openai", **kwargs):
    """Create a client for the specified LLM provider."""
    if provider == "openai":
        from openai import OpenAI
        return OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    elif provider == "azure":
        from openai import AzureOpenAI
        return AzureOpenAI(
            api_key=os.getenv('AZURE_OPENAI_API_KEY'),
            api_version="2024-08-01-preview",
            azure_endpoint="https://msopenai.openai.azure.com"
        )
    elif provider == "deepseek":
        from openai import OpenAI
        return OpenAI(
            api_key=os.getenv('DEEPSEEK_API_KEY'),
            base_url="https://api.deepseek.com/v1"
        )
    elif provider == "anthropic":
        from anthropic import Anthropic
        return Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    elif provider == "gemini":
        import google.generativeai as genai
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
        return genai
    elif provider == "local":
        from openai import OpenAI
        return OpenAI(
            base_url="http://192.168.180.137:8006/v1",
            api_key="not-needed"
        )
    else:
        raise ValueError(f"Unsupported provider: {provider}")

def query_llm(prompt, provider="openai", model=None, client=None, image_path=None, **kwargs):
    """Query an LLM with the given prompt."""
    try:
        if client is None:
            client = create_llm_client(provider)
        
        content = [{"type": "text", "text": prompt}]
        
        if image_path:
            import base64
            with open(image_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"
                    }
                })
        
        if provider == "openai" or provider == "deepseek" or provider == "local" or provider == "azure":
            if model is None:
                if provider == "openai":
                    model = "gpt-4o"
                elif provider == "deepseek":
                    model = "deepseek-chat"
                elif provider == "local":
                    model = "Qwen/Qwen2.5-32B-Instruct-AWQ"
                elif provider == "azure":
                    model = os.getenv('AZURE_OPENAI_MODEL_DEPLOYMENT', 'gpt-4o-ms')
            
            if model == "o1":
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": content}],
                    response_format={"type": "text"},
                    reasoning_effort="low"
                )
            else:
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": content}],
                    temperature=0.7
                )
            return response.choices[0].message.content
            
        elif provider == "anthropic":
            if model is None:
                model = "claude-3-sonnet-20240229"
            
            response = client.messages.create(
                model=model,
                max_tokens=1000,
                messages=[{"role": "user", "content": content}]
            )
            return response.content[0].text
            
        elif provider == "gemini":
            if model is None:
                model = "gemini-pro"
            
            gemini_model = client.GenerativeModel(model)
            response = gemini_model.generate_content(prompt)
            return response.text
            
        else:
            raise ValueError(f"Unsupported provider: {provider}")
            
    except Exception as e:
        print(f"Error querying LLM: {e}")
        return None
