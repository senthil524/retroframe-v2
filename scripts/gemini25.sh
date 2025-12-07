#!/bin/bash
set -e

GEMINI_API_KEY="AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80"
MODEL_ID="gemini-2.5-flash-image"

PROMPT="$1"
OUTPUT_FILE="${2:-output.png}"

echo "Generating with Gemini 2.5 Flash Image..."

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}" \
    -d '{
    "contents": [{"parts": [{"text": "'"$PROMPT"'"}]}],
    "generationConfig": {
        "responseModalities": ["IMAGE", "TEXT"]
    }
}')

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
    echo "Error - no image"
    exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"
echo "Saved: $OUTPUT_FILE ($(ls -lh "$OUTPUT_FILE" | awk '{print $5}'))"
