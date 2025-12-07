# RetroFrame Image Generation Guide

## Overview
This guide documents how to generate high-quality images for the RetroFrame blog and website using Google's Gemini AI.

---

## Quick Start

### Generate an image:
```bash
cd scripts
./gemini25.sh "Your prompt here" output.png
```

### Resize to 16:9 (1920x1080):
```bash
sips -c 576 1024 output.png --out output-cropped.png
sips -z 1080 1920 output-cropped.png --out output-final.png
```

### Upload to Supabase:
```bash
SUPABASE_URL="https://eoxhwqyxxahvnfcvquoa.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0"

curl -X POST "${SUPABASE_URL}/storage/v1/object/files/blog/your-image.png" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: image/png" \
  --data-binary "@output-final.png"
```

---

## Available Scripts

### 1. `gemini25.sh` (Recommended - High Quality)
Uses Gemini 2.5 Flash Image model for best quality.

```bash
./gemini25.sh "Your detailed prompt" output.png
```

### 2. `gemini-image-gen.sh` (Fast)
Uses Gemini 2.0 Flash Exp for quick generation.

```bash
./gemini-image-gen.sh "Your prompt" output.png
```

---

## API Configuration

### Gemini API Key
```
AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80
```

### Best Models for Image Generation
| Model | Quality | Speed | Use Case |
|-------|---------|-------|----------|
| `gemini-2.5-flash-image` | High | Medium | Blog covers, hero images |
| `gemini-2.0-flash-exp` | Medium | Fast | Quick drafts, testing |

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/{MODEL_ID}:generateContent
```

### Request Format
```json
{
  "contents": [{"parts": [{"text": "Your prompt"}]}],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"]
  }
}
```

---

## Writing Effective Prompts

### Structure
```
[Style] + [Subject] + [Details] + [Lighting] + [Quality modifiers]
```

### Best Practices
1. **Be specific** - Describe exactly what you want
2. **Include style** - "photorealistic", "editorial", "lifestyle"
3. **Specify lighting** - "natural sunlight", "warm ambient", "soft window light"
4. **Add quality terms** - "high resolution", "sharp focus", "rich colors"
5. **Mention composition** - "flat lay", "close-up", "wide shot", "16:9"

### Example Prompts

#### Blog Cover - Polaroid Flat Lay
```
Create a photorealistic wide 16:9 image: Beautiful flat lay photography of real polaroid instant photos scattered on a light oak wooden table. The polaroids show authentic happy moments - a smiling young Indian couple taking a selfie, a group of friends laughing at a beach, a cute golden retriever puppy, and a colorful Diwali celebration with lit diyas. Natural soft morning sunlight streaming in, clean minimal aesthetic, high-end lifestyle magazine editorial photography style, sharp focus, rich colors
```

#### Blog Cover - Photo Wall Display
```
Create a photorealistic wide 16:9 image: Cozy bedroom interior with a beautiful photo wall display. Polaroid photos hanging on warm fairy string lights with mini wooden clips against a soft white wall. The photos show real family memories - a wedding couple kissing, a newborn baby, grandparents smiling, and children at a birthday party with cake. Warm ambient evening lighting, boho aesthetic home decor, Instagram-worthy interior design photography, soft bokeh from fairy lights
```

#### Blog Cover - Choosing Photos
```
Create a photorealistic wide 16:9 image: Close-up lifestyle photo of a young Indian woman's hands with delicate jewelry, holding and looking through several polaroid photos spread on a clean white marble desk. The polaroids show her memories - a tropical beach vacation selfie, friends at a coffee shop, a fluffy orange cat, and a sunset landscape. Soft natural window light from the left, lifestyle blogger aesthetic, shallow depth of field with beautiful bokeh, warm and inviting mood
```

#### Product Hero Image
```
Create a photorealistic image: Premium polaroid prints arranged elegantly on a marble surface with soft shadows. Classic white borders, vibrant colors showing family photos. Luxury product photography style, clean white background, studio lighting
```

#### Testimonial/Review Image
```
Create a photorealistic image: Happy young Indian woman holding polaroid prints and smiling at camera. Casual home setting, natural window light, warm and genuine expression, lifestyle photography
```

---

## Image Processing

### Resize to 16:9 (Blog Covers)
Gemini outputs 1024x1024 square images. Crop and resize:

```bash
# Step 1: Crop to 16:9 aspect (1024x576)
sips -c 576 1024 input.png --out cropped.png

# Step 2: Scale to 1920x1080
sips -z 1080 1920 cropped.png --out final.png
```

### Resize to 1:1 (Thumbnails)
```bash
sips -z 400 400 input.png --out thumbnail.png
```

### Convert PNG to JPG (Smaller file size)
```bash
sips -s format jpeg input.png --out output.jpg -s formatOptions 85
```

---

## Supabase Storage

### Upload Image
```bash
SUPABASE_URL="https://eoxhwqyxxahvnfcvquoa.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0"

# Upload PNG
curl -X POST "${SUPABASE_URL}/storage/v1/object/files/blog/filename.png" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: image/png" \
  --data-binary "@local-file.png"

# Upload JPG
curl -X POST "${SUPABASE_URL}/storage/v1/object/files/blog/filename.jpg" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@local-file.jpg"
```

### Public URL Format
```
https://eoxhwqyxxahvnfcvquoa.supabase.co/storage/v1/object/public/files/blog/filename.png
```

### Update Blog Post Image
```sql
UPDATE blog_posts
SET featured_image = 'https://eoxhwqyxxahvnfcvquoa.supabase.co/storage/v1/object/public/files/blog/your-image.png'
WHERE slug = 'your-blog-slug';
```

---

## Complete Workflow Example

### Generate a new blog cover image:

```bash
# 1. Navigate to scripts
cd /Users/senthil/retroframe-b8c23d88\ \(1\)/scripts

# 2. Generate image with Gemini 2.5
./gemini25.sh "Create a photorealistic wide 16:9 image: Beautiful flat lay of polaroid photos on wooden table showing happy family moments. Natural sunlight, magazine editorial style" new-blog-cover.png

# 3. Crop to 16:9
sips -c 576 1024 new-blog-cover.png --out new-blog-cover-cropped.png

# 4. Scale to 1920x1080
sips -z 1080 1920 new-blog-cover-cropped.png --out new-blog-cover-final.png

# 5. Upload to Supabase
SUPABASE_URL="https://eoxhwqyxxahvnfcvquoa.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0"

curl -X POST "${SUPABASE_URL}/storage/v1/object/files/blog/new-blog-cover.png" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: image/png" \
  --data-binary "@new-blog-cover-final.png"

# 6. Image URL is now:
# https://eoxhwqyxxahvnfcvquoa.supabase.co/storage/v1/object/public/files/blog/new-blog-cover.png
```

---

## Troubleshooting

### "No image found" error
- Check API key is valid
- Try a simpler prompt
- Use `gemini-2.5-flash-image` model

### Image quality is poor
- Use `gemini25.sh` instead of `gemini-image-gen.sh`
- Add quality terms: "high resolution", "sharp focus", "8K", "photorealistic"
- Be more specific in prompt

### Wrong aspect ratio
- Gemini outputs 1024x1024 by default
- Always crop/resize after generation
- Use sips commands above

### Upload fails
- Check Supabase key is correct
- Ensure bucket "files" exists and is public
- Check file path is correct

---

## Current Blog Images

| Blog Post | Image URL |
|-----------|-----------|
| Ultimate Guide | `cover-guide-hq.png` |
| Display Ideas | `cover-display-hq.png` |
| Choosing Photos | `cover-choose-hq.png` |

---

## Reference Links

- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/image-generation)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)

---

*Last updated: December 2024*
