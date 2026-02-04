"""
Upload property images to WordPress via REST API
Usage: python upload-images-api.py username app_password
"""

import os
import sys
import base64

# Check for credentials
if len(sys.argv) < 3:
    print("Usage: python upload-images-api.py <username> <app-password>")
    print("\nTo create app password:")
    print("1. Go to WordPress Admin → Users → Profile")
    print("2. Scroll to 'Application Passwords'")
    print("3. Create a new password with a name like 'OpenClaw'")
    print("4. Use the generated password as the second argument")
    sys.exit(1)

username = sys.argv[1]
app_password = sys.argv[2]
site_url = "https://airealent.ng"

image_files = [
    r"C:\Users\USER\.openclaw\media\inbound\file_10---99dfec50-5728-4273-ab7e-43e884d2570c.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_11---96dd1145-2548-4a76-bc2e-fdfbc4ad670c.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_12---1ce1af4e-253d-4e10-b720-1f902ef285f1.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_13---98ef0be2-9bc2-473f-9a8d-c31bb65b2e83.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_14---49daf79e-fcd1-4535-bfcf-69dd4677649e.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_15---4e4551b5-7ce4-4624-8cb9-09af8a6d6b57.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_16---df727929-1313-4c7b-9306-093d2aec624d.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_17---8eb4567a-b40a-45af-ad9c-ea268f37ca62.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_18---efaaa479-e8c7-4263-98ed-9f5e365b20a0.jpg",
    r"C:\Users\USER\.openclaw\media\inbound\file_19---ae6ca763-005e-4c4c-b6c2-30fba4407ede.jpg",
]

property_id = 18851

print("Property Image Upload via REST API")
print("=" * 40)
print(f"Site: {site_url}")
print(f"Property ID: {property_id}")
print(f"Images to upload: {len(image_files)}")
print()

# Check files exist
valid_files = []
for f in image_files:
    if os.path.exists(f):
        valid_files.append(f)
        print(f"✓ {os.path.basename(f)}")
    else:
        print(f"✗ {f} - NOT FOUND")

print(f"\n{len(valid_files)} files ready for upload")

# Note: Requires 'requests' library
# pip install requests
try:
    import requests
except ImportError:
    print("\nInstalling requests library...")
    os.system("pip install requests")
    import requests

# Upload each file
auth = f"{username}:{app_password}"
headers = {
    'Content-Disposition': '',
}

uploaded_ids = []
for i, filepath in enumerate(valid_files):
    filename = os.path.basename(filepath)
    print(f"\nUploading [{i+1}/{len(valid_files)}]: {filename}")
    
    with open(filepath, 'rb') as f:
        content = f.read()
    
    headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    headers['Content-Type'] = 'image/jpeg'
    
    try:
        response = requests.post(
            f"{site_url}/wp-json/wp/v2/media",
            headers=headers,
            data=content,
            auth=(username, app_password)
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            print(f"  ✓ Uploaded! Media ID: {data['id']}")
            uploaded_ids.append(data['id'])
        else:
            print(f"  ✗ Failed: {response.status_code} - {response.text[:100]}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

print("\n" + "=" * 40)
print("SUMMARY")
print(f"Uploaded: {len(uploaded_ids)}")
print(f"Media IDs: {uploaded_ids}")
