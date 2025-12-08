const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80';
const MODEL_ID = 'gemini-3-pro-image-preview';
const OUTPUT_DIR = path.join(__dirname, '../public/hero-images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Carefully written prompt - photos shown from FRONT side (image visible to camera)
const prompt = `E-commerce product photography style image.

Two hands holding a fan of 5-6 polaroid instant photo prints, spread out like playing cards. THE PHOTO SIDE IS FACING THE CAMERA - we can see the actual images printed on the polaroids, not the white back.

EXACT PRODUCT SPECIFICATIONS:
- Polaroid print size: 3.4 inches wide x 4 inches tall
- White border frame all around
- Bottom white border is thicker (classic Polaroid style)
- Square photo area: 3 inches x 3 inches inside the frame
- Glossy photo finish

The polaroid photos show: a couple selfie, beach sunset, friends group photo, a cute dog, colorful street scene - all vibrant and colorful images visible to camera.

Background: Clean white or very light cream, minimal, like product photography on white seamless backdrop.

Hands: Indian woman's hands with simple jewelry (thin bracelet), well-manicured natural nails.

Lighting: Soft studio lighting, slight shadow underneath for depth, professional e-commerce product shot aesthetic.

Style: Clean, minimal, professional product photography like you see on premium e-commerce websites. Sharp focus on the polaroid prints. Photorealistic, high resolution.`;

async function generateImage() {
  console.log('='.repeat(50));
  console.log('Generating E-commerce style product image');
  console.log('Model: gemini-3-pro-image-preview');
  console.log('='.repeat(50));
  console.log('\nPrompt summary: Hands holding polaroids with FRONT side (images) visible to camera\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"]
          }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Error:', data.error.message);
      return null;
    }

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const mimeType = part.inlineData.mimeType || 'image/png';
          const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
          const outputPath = path.join(OUTPUT_DIR, `test-image.${ext}`);
          fs.writeFileSync(outputPath, imageBuffer);
          console.log('✓ Saved: test-image.' + ext);
          console.log('\nCheck: public/hero-images/test-image.' + ext);
          return outputPath;
        }
      }
    }

    console.log('No image data. Response:', JSON.stringify(data, null, 2));
    return null;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

generateImage();
