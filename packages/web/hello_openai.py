#!/usr/bin/env python3

import os
import requests
import json

def hello_world_openai():
    # Get API key from environment variable
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
    
    # OpenAI API endpoint
    url = "https://api.openai.com/v1/chat/completions"
    
    # Headers
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Request payload
    data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user", 
                "content": "Say hello world in a creative way!"
            }
        ],
        "max_tokens": 100,
        "temperature": 0.7
    }
    
    try:
        # Make the API request
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        message = result['choices'][0]['message']['content']
        
        print("OpenAI GPT-4o Response:")
        print("=" * 40)
        print(message)
        print("=" * 40)
        
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
    except KeyError as e:
        print(f"Error parsing response: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    hello_world_openai()
