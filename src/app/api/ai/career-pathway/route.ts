import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const { currentSkills, targetRole, experience } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Create a career pathway plan.
      Current Skills: ${currentSkills?.join(', ')}
      Target Role: ${targetRole}
      Experience Level: ${experience}
      
      Generate a step-by-step learning pathway to reach the target role.
      Return ONLY a JSON array of objects, each representing a step, with keys: 
      'stepName', 'description', 'skillsToAcquire' (array of strings), 'estimatedDuration'.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    let pathway = [];
    try {
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        pathway = JSON.parse(jsonMatch[0]);
      } else {
        pathway = JSON.parse(textResponse);
      }
    } catch (e) {
      return NextResponse.json({ error: 'Failed to generate pathway' }, { status: 500 });
    }

    return NextResponse.json({ pathway });
  } catch (error) {
    console.error('Error in career pathway:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
