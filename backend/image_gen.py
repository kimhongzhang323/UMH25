from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe.to("cuda")

def generate_image(prompt):
    image = pipe(prompt).images[0]
    image_path = f"generated/{prompt[:10].replace(' ', '_')}.png"
    image.save(image_path)
    return image_path
