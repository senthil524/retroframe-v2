#!/bin/bash
set -e

GEMINI_API_KEY="AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80"
MODEL_ID="gemini-2.0-flash-exp"
API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent"

if [ -z "$1" ]; then
    echo "Usage: $0 \"prompt\" output.png"
    exit 1
fi

PROMPT="$1"
OUTPUT_FILE="${2:-generated_image.png}"

echo "Generating 16:9 image: $PROMPT"

REQUEST_JSON=$(cat << ENDJSON
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
        "responseModalities": ["TEXT", "IMAGE"],
        "imageDimension": "LANDSCAPE_16_9"
    }
}
ENDJSON
)

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "${API_ENDPOINT}?key=${GEMINI_API_KEY}" \
    -d "$REQUEST_JSON")

if echo "$RESPONSE" | grep -q '"error"'; then
    echo "Error:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

IMAGE_DATA=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for candidate in data.get('candidates', []):
        for part in candidate.get('content', {}).get('parts', []):
            if 'inlineData' in part:
                print(part['inlineData']['data'])
                sys.exit(0)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
")

if [ -z "$IMAGE_DATA" ]; then
    echo "No image data found"
    exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"
echo "Saved: $OUTPUT_FILE"
