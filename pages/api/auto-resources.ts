import { NextApiRequest, NextApiResponse } from 'next';
import { AutoResource } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { taskTitle, goal } = req.body;

    if (!taskTitle || !goal) {
      return res.status(400).json({ message: 'Task title and goal are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured, using fallback resources');
      const fallbackResources = getFallbackResources(taskTitle);
      return res.status(200).json({ resources: fallbackResources });
    }

    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that finds relevant resources for tasks. Return only a JSON array of objects with 'url', 'title', and 'relevance' (1-10) fields."
        },
        {
          role: "user",
          content: `Find 3-5 relevant online resources for this task: "${taskTitle}" related to goal: "${goal}". Focus on high-quality, educational resources.`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let resources: AutoResource[];
    try {
      const parsed = JSON.parse(response);
      resources = Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      console.log('Raw response:', response);
      resources = getFallbackResources(taskTitle);
    }

    if (resources.length === 0) {
      resources = getFallbackResources(taskTitle);
    }

    res.status(200).json({ resources });

  } catch (error) {
    console.error('Error finding auto resources:', error);
    const fallbackResources = getFallbackResources(req.body?.taskTitle || 'task');
    res.status(200).json({ resources: fallbackResources });
  }
}

function getFallbackResources(taskTitle: string): AutoResource[] {
  const taskLower = taskTitle.toLowerCase();
  
  if (taskLower.includes('react') || taskLower.includes('javascript') || taskLower.includes('web')) {
    return [
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        title: 'MDN JavaScript Documentation',
        relevance: 9,
        source: 'ai-search'
      },
      {
        url: 'https://react.dev/',
        title: 'React Official Documentation',
        relevance: 9,
        source: 'ai-search'
      },
      {
        url: 'https://stackoverflow.com/questions/tagged/react',
        title: 'Stack Overflow React Questions',
        relevance: 8,
        source: 'ai-search'
      }
    ];
  }
  
  if (taskLower.includes('python') || taskLower.includes('programming')) {
    return [
      {
        url: 'https://docs.python.org/3/',
        title: 'Python Official Documentation',
        relevance: 9,
        source: 'ai-search'
      },
      {
        url: 'https://realpython.com/',
        title: 'Real Python Tutorials',
        relevance: 8,
        source: 'ai-search'
      },
      {
        url: 'https://stackoverflow.com/questions/tagged/python',
        title: 'Stack Overflow Python Questions',
        relevance: 8,
        source: 'ai-search'
      }
    ];
  }
  
  return [
    {
      url: 'https://developer.mozilla.org',
      title: 'MDN Web Docs',
      relevance: 8,
      source: 'ai-search'
    },
    {
      url: 'https://stackoverflow.com',
      title: 'Stack Overflow',
      relevance: 7,
      source: 'ai-search'
    },
    {
      url: 'https://github.com',
      title: 'GitHub',
      relevance: 6,
      source: 'ai-search'
    }
  ];
} 