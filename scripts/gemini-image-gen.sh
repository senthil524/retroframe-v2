#!/bin/bash
set -e

# Gemini Image Generation Script
# Usage: ./gemini-image-gen.sh "Your prompt here" [output_filename]

GEMINI_API_KEY="AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80"
MODEL_ID="gemini-2.0-flash-exp"
API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent"

# Check if prompt is provided
if [ -z "$1" ]; then
    echo "Usage: $0 \"Your prompt here\" [output_filename]"
    echo "Example: $0 \"A cozy polaroid photo of a sunset at the beach\" sunset.png"
    exit 1
fi

PROMPT="$1"
OUTPUT_FILE="${2:-generated_image.png}"

echo "Generating image with prompt: $PROMPT"
echo "Model: $MODEL_ID"
echo ""

# Create request JSON
REQUEST_JSON=$(cat << EOF
{
    "contents": [
        {
            "parts": [
                {
                    "text": "$PROMPT"
                }
            ]
        }
    ],
    "generationConfig": {
        "responseModalities": ["TEXT", "IMAGE"]
    }
}
EOF
)

# Make API request
RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "${API_ENDPOINT}?key=${GEMINI_API_KEY}" \
    -d "$REQUEST_JSON")

# Check for errors
if echo "$RESPONSE" | grep -q '"error"'; then
    echo "Error from API:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

# Extract base64 image data and save
IMAGE_DATA=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for candidate in data.get('candidates', []):
        for part in candidate.get('content', {}).get('parts', []):
            if 'inlineData' in part:
                print(part['inlineData']['data'])
                sys.exit(0)
    print('NO_IMAGE', file=sys.stderr)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
")

if [ -z "$IMAGE_DATA" ] || [ "$IMAGE_DATA" = "" ]; then
    echo "No image data found in response"
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

# Decode and save image
echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"

echo "Image saved to: $OUTPUT_FILE"
echo "Done!"
