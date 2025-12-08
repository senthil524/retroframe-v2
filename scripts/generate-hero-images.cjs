const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDGN-Z3EONuR3u1Jbvo9Xzgx9b1DGGsO80';
const MODEL_ID = 'gemini-3-pro-image-preview';
const OUTPUT_DIR = path.join(__dirname, '../public/hero-images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Product specs constant
const PRODUCT_SPECS = `
POLAROID SPECIFICATIONS (must be accurate):
- Size: 3.4 inches wide x 4 inches tall
- White border frame, thicker at bottom (classic Polaroid style)
- Square photo area: 3 inches x 3 inches
- Photo side facing camera (images visible)
`;

// 8 compelling images - ALL featuring INDIAN people
const prompts = [
  // 1. Hero product shot - Indian hands
  `Square format professional product photography.

Young Indian woman's hands (brown skin, simple gold bangles) elegantly holding 5 polaroid prints fanned out like cards, photo side facing camera showing colorful images - Goa beach sunset, couple at Taj Mahal, friends at Diwali party, pet dog, South Indian food.

${PRODUCT_SPECS}

Clean white background. Soft studio lighting. Premium e-commerce aesthetic.

Photorealistic, sharp focus. Makes Indian viewers want to hold these prints.`,

  // 2. Gifting moment - Indian context
  `Square format lifestyle photography.

Indian woman's hands (wearing traditional gold ring, mehndi traces visible) pulling polaroid prints from a brown kraft gift envelope. 4 polaroids showing - Haldi ceremony, beach trip, wedding sangeet, baby mundan ceremony.

${PRODUCT_SPECS}

Soft cream background. Warm natural lighting.

Emotional gifting moment for Indian occasions - Rakhi, Diwali, birthday. Photorealistic.`,

  // 3. Wall decor - Indian bedroom
  `Square format interior photography.

Polaroid prints arranged on bedroom wall with fairy lights and jute string with wooden clips. 8 polaroids showing Indian family moments - parents anniversary, siblings, college friends, travel to Ladakh, Goa trip.

${PRODUCT_SPECS}

Modern Indian middle-class bedroom. White walls, colorful bedsheet visible below. Afternoon sunlight.

Aspirational room decor for Indian youth. Photorealistic interior style.`,

  // 4. Unboxing - Indian hands
  `Square format product photography.

Indian woman's hands (brown skin, simple jewelry) opening brown kraft delivery box on wooden table. Inside: neatly stacked polaroid prints with tissue paper. Top polaroid shows happy Indian couple photo.

${PRODUCT_SPECS}

Clean background. Natural daylight. Excitement of receiving order.

Premium unboxing experience. Photorealistic.`,

  // 5. Study desk - Indian student
  `Square format lifestyle photography.

Indian college student's study desk with polaroid prints on cork board and small easel. Polaroids show graduation day, college fest, friends group, family photo.

${PRODUCT_SPECS}

Books, laptop edge, chai cup visible. Typical Indian student room aesthetic. Natural window light.

Relatable for Indian students and young professionals. Photorealistic.`,

  // 6. Indian couple memories
  `Square format emotional photography.

Young Indian couple's hands together holding polaroid prints of their journey - first date at cafe, Goa trip, proposal with ring, Haldi ceremony, wedding reception candid.

${PRODUCT_SPECS}

Soft warm lighting. Indian home setting blurred behind. Intimate moment.

Perfect anniversary or Valentine's gift for Indian couples. Photorealistic.`,

  // 7. Indian girls friendship
  `Square format lifestyle photography.

Flat lay on pastel bedsheet - 6-7 polaroid prints showing Indian girls' friendship moments - college canteen, Diwali celebration in sarees, beach trip in kurtis, cafe selfies, matching outfit photos.

${PRODUCT_SPECS}

Fairy lights, phone, jhumka earrings, scrunchie as props. Warm pink tones.

Indian bestie goals. Gen-Z Indian aesthetic. Photorealistic.`,

  // 8. Indian baby/family
  `Square format heartwarming photography.

Indian mother's hands (mangalsutra visible on wrist, mehendi traces) gently holding 4 polaroid prints - newborn in hospital, naming ceremony, annaprashan rice ceremony, first birthday with cake.

${PRODUCT_SPECS}

Soft dreamy lighting. Cream background.

Precious Indian family memories. Makes Indian parents emotional. Photorealistic.`
];

async function generateImage(prompt, index) {
  console.log(`\n[${index + 1}/8] Generating image...`);

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
      console.error(`Error:`, data.error.message);
      return null;
    }

    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const ext = part.inlineData.mimeType?.includes('jpeg') ? 'jpg' : 'png';
          const outputPath = path.join(OUTPUT_DIR, `hero-${index + 1}.${ext}`);
          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`✓ Saved: hero-${index + 1}.${ext}`);
          return outputPath;
        }
      }
    }

    console.log(`No image data`);
    return null;
  } catch (error) {
    console.error(`Error:`, error.message);
    return null;
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('GENERATING 8 HERO IMAGES - INDIAN CONTEXT');
  console.log('Model: gemini-3-pro-image-preview');
  console.log('All images feature Indian people & culture');
  console.log('='.repeat(50));

  // Clear old images
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (file.startsWith('hero-')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
  console.log('\nCleared old hero images');

  for (let i = 0; i < prompts.length; i++) {
    await generateImage(prompts[i], i);
    if (i < prompts.length - 1) {
      console.log('Waiting 4 seconds...');
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('DONE! Generated 8 Indian-focused images');
  console.log('='.repeat(50));
}

main();
