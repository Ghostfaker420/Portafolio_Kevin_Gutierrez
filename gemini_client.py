import base64
import os
from google import genai
from google.genai import types


def generate(prompt: str):
    """Generate content using Gemini API with the given prompt."""
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-pro-preview-03-25"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
    )

    try:
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                print(chunk.text, end="")
    except Exception as e:
        print(f"Error generating content: {e}")


if __name__ == "__main__":
    user_input = input("Enter your prompt: ")
    generate(user_input)