import os
from PIL import Image

def remove_white_background(input_path, output_path):
    print(f"Opening image: {input_path}")
    if not os.path.exists(input_path):
        print(f"Error: Input path {input_path} does not exist.")
        return
    
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # Loop over all pixels and make near-white pixels transparent
    for item in data:
        # Check if pixel is close to white (threshold of 240 for R, G, B)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            # Make transparent
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Saved processed logo to: {output_path}")

if __name__ == "__main__":
    input_file = r"C:\Users\Hizkia Ariel Wijono\.gemini\antigravity\brain\82072d0a-bbaf-495b-a463-e6de606db638\media__1783489871320.png"
    output_file = r"C:\Users\Hizkia Ariel Wijono\.gemini\antigravity\scratch\cut-o-clock\assets\images\logo.png"
    remove_white_background(input_file, output_file)
