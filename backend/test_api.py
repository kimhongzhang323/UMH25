import requests
import base64

url = "http://127.0.0.1:8000/generate"
payload = {
    "prompt": "Tung Tung Tung Tung Tung Sahur",
    "steps": 50,
    "guidance_scale": 7.5,
    "width": 512,
    "height": 512
}

def test_generation():
    try:
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print("Prompt:", result["prompt"])

            # Save the image to a file
            image_data = result["image"].split(",")[1]  # Remove the data URL prefix
            with open("generated_image.png", "wb") as f:
                f.write(base64.b64decode(image_data))
            print("Image saved as generated_image.png")
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.ConnectionError:
        print("Could not connect to the server. Make sure it's running first.")
    except Exception as e:
        print("An error occurred:", str(e))

if __name__ == "__main__":
    test_generation()