#!/bin/bash
set -e

GEMINI_API_KEY="AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80"
MODEL_ID="imagen-3.0-generate-002"
API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:predict"

PROMPT="$1"
OUTPUT_FILE="${2:-output.png}"

echo "Generating with Imagen 3: $PROMPT"

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "${API_ENDPOINT}?key=${GEMINI_API_KEY}" \
    -d '{
    "instances": [{"prompt": "'"$PROMPT"'"}],
    "parameters": {
        "sampleCount": 1,
        "aspectRatio": "16:9",
        "personGeneration": "allow_adult"
    }
}')

if echo "$RESPONSE" | grep -q '"error"'; then
    echo "Error:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

IMAGE_DATA=$(echo "$RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for pred in data.get('predictions', []):
    if 'bytesBase64Encoded' in pred:
        print(pred['bytesBase64Encoded'])
        sys.exit(0)
print('NO_IMAGE')
")

if [ "$IMAGE_DATA" = "NO_IMAGE" ] || [ -z "$IMAGE_DATA" ]; then
    echo "No image found, trying alternate format..."
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"
echo "Saved: $OUTPUT_FILE"
