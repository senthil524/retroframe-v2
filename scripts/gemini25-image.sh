#!/bin/bash
set -e

GEMINI_API_KEY="AIzaSyDFgtAX1ySl2A34R7XZaIRzb0HhooTAmZA"
MODEL_ID="gemini-3-pro-image-preview"
API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent"

PROMPT="$1"
OUTPUT_FILE="${2:-output.png}"

echo "Generating with Gemini 2.5 Flash Image..."

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "${API_ENDPOINT}?key=${GEMINI_API_KEY}" \
    -d '{
    "contents": [{"parts": [{"text": "'"$PROMPT"'"}]}],
    "generationConfig": {
        "responseModalities": ["IMAGE", "TEXT"],
        "imageConfig": {
            "aspectRatio": "16:9"
        }
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
for candidate in data.get('candidates', []):
    for part in candidate.get('content', {}).get('parts', []):
        if 'inlineData' in part:
            print(part['inlineData']['data'])
            sys.exit(0)
")

if [ -z "$IMAGE_DATA" ]; then
    echo "No image found"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null | head -30
    exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"
echo "Saved: $OUTPUT_FILE ($(ls -lh "$OUTPUT_FILE" | awk '{print $5}'))"
