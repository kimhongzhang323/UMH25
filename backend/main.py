from fastapi import FastAPI
from pydantic import BaseModel
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
