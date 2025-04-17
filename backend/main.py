import os
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()
MOCK_AI = os.getenv("MOCK_AI")

# Import mock AI APIs if just testing backend
if MOCK_AI == "true":
    from mock_ai import generate_text, generate_image
else:
    from llm import generate_text
    from image_gen import generate_image

app = FastAPI()


class Prompt(BaseModel):
    prompt: str


@app.post("/text")
def text_response(data: Prompt):
    return {"response": generate_text(data.prompt)}


@app.post("/image")
def image_response(data: Prompt):
    path = generate_image(data.prompt)
    return {"image_url": f"/static/{path}"}
