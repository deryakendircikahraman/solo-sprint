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
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: 'Goal is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that breaks down goals into 3-5 actionable tasks. Return only a JSON array of task strings, nothing else."
        },
        {
          role: "user",
          content: `Break down this goal into 3-5 actionable tasks: "${goal}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    let tasks;
    try {
      tasks = JSON.parse(response);
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      console.log('Raw response:', response);
      
      // Fallback: provide generic tasks
      tasks = [
        "Research and gather information",
        "Create a plan or outline", 
        "Execute the main task",
        "Review and refine the work"
      ];
    }

    // Ensure tasks is an array
    if (!Array.isArray(tasks)) {
      tasks = [
        "Research and gather information",
        "Create a plan or outline", 
        "Execute the main task",
        "Review and refine the work"
      ];
    }

    res.status(200).json({ tasks });

  } catch (error) {
    console.error('Error breaking down goal:', error);
    res.status(500).json({ 
      message: 'Failed to break down goal. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 