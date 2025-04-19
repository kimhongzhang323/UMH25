from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO
import base64
from typing import Optional

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = "cuda" if torch.cuda.is_available() else "cpu"
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
)
pipe = pipe.to(device)

# Pydantic schema
class GenerationRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    steps: int = 50
    guidance_scale: float = 7.5
    width: int = 512
    height: int = 512

# Pre-prompt theme
BASE_THEME = (
    "Warm, cozy, elegant Chinese dim sum restaurant scene with bamboo steamers, wooden textures, "
    "natural lighting, minimalist design, and vibrant food presentation. Branding image for DimSumDelight. — "
)

@app.post("/chatbot-generate")
async def chatbot_generate(request: GenerationRequest):
    try:
        # Merge pre-prompt theme with user prompt
        full_prompt = BASE_THEME + request.prompt

        # Generate image
        image = pipe(
            prompt=full_prompt,
            negative_prompt=request.negative_prompt,
            num_inference_steps=request.steps,
            guidance_scale=request.guidance_scale,
            width=request.width,
            height=request.height
        ).images[0]

        # Encode image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return JSONResponse({
            "response": f"<p><strong>{request.prompt}</strong></p><img src='data:image/png;base64,{img_str}' alt='Generated Image' style='max-width:100%; border-radius:8px;' />",
            "prompt": request.prompt
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
