#!/bin/bash
# Generate Blog-Ready Image (16:9, 1920x1080)
# Usage: ./generate-blog-image.sh "Your prompt" output-name
# Example: ./generate-blog-image.sh "Polaroid photos on table" my-blog-cover

set -e

GEMINI_API_KEY="AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80"
MODEL_ID="gemini-2.5-flash-image"

if [ -z "$1" ]; then
    echo "Usage: $0 \"Your prompt\" output-name"
    echo "Example: $0 \"Polaroid photos on wooden table\" blog-cover"
    exit 1
fi

PROMPT="$1"
OUTPUT_NAME="${2:-generated}"
TEMP_FILE="${OUTPUT_NAME}-raw.png"
FINAL_FILE="${OUTPUT_NAME}.png"

echo "============================================"
echo "RetroFrame Blog Image Generator"
echo "============================================"
echo ""
echo "Step 1/3: Generating image with Gemini 2.5..."

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
    echo "Error: No image generated"
    exit 1
fi

echo "$IMAGE_DATA" | base64 -d > "$TEMP_FILE"
echo "   Generated: $TEMP_FILE ($(ls -lh "$TEMP_FILE" | awk '{print $5}'))"

echo ""
echo "Step 2/3: Resizing to 16:9 (1920x1080)..."
# Crop to 16:9 from 1024x1024
sips -c 576 1024 "$TEMP_FILE" --out "${OUTPUT_NAME}-cropped.png" >/dev/null 2>&1
# Scale to 1920x1080
sips -z 1080 1920 "${OUTPUT_NAME}-cropped.png" --out "$FINAL_FILE" >/dev/null 2>&1
# Cleanup temp files
rm -f "$TEMP_FILE" "${OUTPUT_NAME}-cropped.png"
echo "   Resized: $FINAL_FILE ($(ls -lh "$FINAL_FILE" | awk '{print $5}'))"

echo ""
echo "Step 3/3: Ready to upload!"
echo ""
echo "============================================"
echo "Image saved: $FINAL_FILE"
echo "Dimensions: 1920x1080 (16:9)"
echo "============================================"
echo ""
echo "To upload to Supabase, run:"
echo ""
echo "SUPABASE_URL=\"https://eoxhwqyxxahvnfcvquoa.supabase.co\""
echo "SUPABASE_KEY=\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0\""
echo ""
echo "curl -X POST \"\${SUPABASE_URL}/storage/v1/object/files/blog/${OUTPUT_NAME}.png\" \\"
echo "  -H \"Authorization: Bearer \${SUPABASE_KEY}\" \\"
echo "  -H \"Content-Type: image/png\" \\"
echo "  --data-binary \"@${FINAL_FILE}\""
echo ""
echo "Public URL will be:"
echo "https://eoxhwqyxxahvnfcvquoa.supabase.co/storage/v1/object/public/files/blog/${OUTPUT_NAME}.png"
