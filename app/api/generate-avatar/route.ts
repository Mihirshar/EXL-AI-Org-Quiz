import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AVATAR_PROMPT = `Transform the provided input photo into a high-quality stylized digital avatar \
while preserving the person's core facial identity.

Identity Preservation Rules:
- Maintain accurate facial structure, eye spacing, nose shape, and mouth shape
- Keep hairstyle and hairline recognizable
- Preserve skin tone naturally (do NOT lighten or darken unnaturally)
- Do NOT change gender, age group, or ethnicity
- Remove temporary blemishes only (pimples, shine), but keep natural skin texture

Style Requirements:
- Style: modern premium 3D semi-realistic avatar
- Vibe: friendly, confident, professional, visually appealing
- Lighting: soft cinematic studio lighting
- Background: clean gradient or subtle tech background
- Expression: slight natural smile, approachable
- Framing: centered head and shoulders portrait
- Quality: ultra sharp, high detail, commercial quality

Enhancements (allowed):
- improve lighting and clarity
- smooth minor skin imperfections
- slightly enhance eyes for liveliness
- clean up flyaway hair

Strict Safety Rules:
- no exaggeration or caricature
- no extreme beautification
- no race or skin tone alteration
- no extra limbs or distorted anatomy
- no text, watermark, or logo

Output a single polished avatar image suitable for use in an interactive AI booth experience.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
      return NextResponse.json(
        { error: 'No photo provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not configured');
      return NextResponse.json(
        { error: 'API key not configured', fallback: true },
        { status: 500 }
      );
    }

    const photoBuffer = await photo.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString('base64');

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    console.log('Calling Gemini for avatar generation...');

    const result = await model.generateContent([
      AVATAR_PROMPT,
      {
        inlineData: {
          mimeType: photo.type || 'image/png',
          data: photoBase64,
        },
      },
    ]);

    const response = result.response;
    
    if (!response.candidates || response.candidates.length === 0) {
      console.error('Gemini returned no candidates');
      return NextResponse.json(
        { error: 'No response from AI', fallback: true },
        { status: 500 }
      );
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts) {
      console.error('Gemini candidate has no content');
      return NextResponse.json(
        { error: 'Invalid response from AI', fallback: true },
        { status: 500 }
      );
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
        console.log('Gemini avatar generated successfully');
        
        const avatarBase64 = part.inlineData.data;
        const avatarDataUrl = `data:${part.inlineData.mimeType};base64,${avatarBase64}`;
        
        return NextResponse.json({
          success: true,
          avatarUrl: avatarDataUrl,
          method: 'gemini',
        });
      }
    }

    console.error('Gemini response had no image parts');
    return NextResponse.json(
      { error: 'No image in response', fallback: true },
      { status: 500 }
    );

  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Avatar generation failed', fallback: true },
      { status: 500 }
    );
  }
}
