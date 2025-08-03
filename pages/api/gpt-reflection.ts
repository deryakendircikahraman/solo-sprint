import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { focusData } = req.body;

    if (!focusData) {
      return res.status(400).json({ message: 'Focus data is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an empathetic AI assistant that provides emotional reflection and insights based on productivity data. Be encouraging and constructive."
        },
        {
          role: "user",
          content: `Based on this focus session data, provide a brief emotional reflection and one actionable recommendation:

Focus Percentage: ${focusData.focusPercentage}%
Distraction Percentage: ${focusData.distractionPercentage}%
Tab Switches: ${focusData.tabSwitches}
Duration: ${focusData.duration} minutes
Emotional State: ${focusData.emotionalState}

Keep the response under 100 words and be encouraging.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reflection = completion.choices[0]?.message?.content;
    
    if (!reflection) {
      throw new Error('No response from OpenAI');
    }

    res.status(200).json({ reflection });

  } catch (error) {
    console.error('Error generating reflection:', error);
    res.status(500).json({ 
      message: 'Failed to generate reflection. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 