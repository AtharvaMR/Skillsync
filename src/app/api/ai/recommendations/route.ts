import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const { courseName, sector, skills } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Generate curriculum recommendations for a course.
      Course: ${courseName}
      Sector: ${sector}
      Current Skills Covered: ${skills?.join(', ') || 'None specified'}
      
      Suggest 3 specific actionable recommendations to improve this course curriculum 
      based on current industry trends in India.
      Return ONLY a JSON array of objects with keys: 'title', 'description', 'impact' (High/Medium/Low), 'effort' (High/Medium/Low).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    let recommendations = [];
    try {
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(textResponse);
      }
    } catch (e) {
      return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error in recommendations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
