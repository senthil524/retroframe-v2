const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80';
const MODEL_ID = 'gemini-2.5-flash-image';
const OUTPUT_DIR = path.join(__dirname, '../public/hero-images');

// Additional Gen Z lifestyle images - starting from hero-9
const prompts = [
  // Image 9 - College friends moment
  "Realistic photograph of Indian college girls in their early 20s looking at polaroid prints together, sitting in a trendy cafe or college canteen. One girl holding 3-4 polaroid prints showing their group photos, fest moments. Polaroids are 3.4 x 4 inch with white borders. Friends laughing and pointing at photos. Casual trendy outfits. Natural indoor lighting. Candid authentic moment, shot on smartphone aesthetic.",

  // Image 10 - Gift giving moment
  "Realistic photograph of young Indian woman gifting a brown kraft paper envelope containing polaroid prints to her best friend. The friend opening it excitedly, pulling out 4-5 polaroid prints. Polaroids are 3.4 x 4 inch showing their friendship moments. Birthday or Friendship Day celebration setting with minimal decorations. Genuine happy expressions. Natural lighting. Real candid photography style.",

  // Image 11 - Travel memories display
  "Realistic photograph of a young Indian traveler woman in her room, arranging polaroid prints from her recent trip on her study table. Polaroids show Goa beaches, Ladakh mountains, Rajasthan forts. 3.4 x 4 inch size with white borders. Backpack and travel souvenirs visible nearby. Natural window light. Nostalgic mood, planning next adventure. Authentic lifestyle photography.",

  // Image 12 - Couple anniversary gift
  "Realistic photograph of young Indian couple sitting together, the guy surprising his girlfriend with polaroid prints of their relationship journey. She's holding polaroids showing their first date, proposal, travels together. 3.4 x 4 inch prints with white borders. Cozy home setting with fairy lights. Emotional happy moment. Warm evening lighting. Real couple photography, not posed."
];

async function generateImage(prompt, index) {
  const imageNumber = index + 9; // Starting from hero-9
  console.log(`\nGenerating image ${imageNumber}...`);
  console.log(`Prompt: ${prompt.substring(0, 80)}...`);

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
      console.error(`Error for image ${imageNumber}:`, data.error.message);
      return null;
    }

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const mimeType = part.inlineData.mimeType || 'image/png';
          const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
          const outputPath = path.join(OUTPUT_DIR, `hero-${imageNumber}.${ext}`);
          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`✓ Saved: hero-${imageNumber}.${ext}`);
          return outputPath;
        }
      }
    }

    console.log(`No image data. Response:`, JSON.stringify(data).substring(0, 300));
    return null;
  } catch (error) {
    console.error(`Error:`, error.message);
    return null;
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('Generating ADDITIONAL Lifestyle Images');
  console.log('Images 9-12: Gen Z, friends, gifts, travel');
  console.log('='.repeat(50));

  for (let i = 0; i < prompts.length; i++) {
    await generateImage(prompts[i], i);
    if (i < prompts.length - 1) {
      console.log('Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Done! Added hero-9 to hero-12');
  console.log('='.repeat(50));
}

main();
