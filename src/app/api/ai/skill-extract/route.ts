import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Extract all professional skills from the following job description.
      Categorize them into 'hard_skill', 'soft_skill', 'tool', or 'technology'.
      Return ONLY a JSON array of objects with 'name' and 'category' keys.
      
      Job Description:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Attempt to parse JSON from the response
    let skills = [];
    try {
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        skills = JSON.parse(jsonMatch[0]);
      } else {
        skills = JSON.parse(textResponse);
      }
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON', textResponse);
      return NextResponse.json({ error: 'Failed to extract skills' }, { status: 500 });
    }

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error in skill extraction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
