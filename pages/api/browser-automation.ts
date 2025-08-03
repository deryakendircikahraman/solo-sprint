import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { action, url, taskId } = req.body;

    if (!action || !url) {
      return res.status(400).json({ message: 'Action and URL are required' });
    }

    console.log(`Browser automation: ${action} on ${url}`);

    let result;
    switch (action) {
      case 'open-resource':
        result = await simulateOpenResource(url, taskId);
        break;
      case 'track-focus':
        result = await simulateFocusTracking(url);
        break;
      case 'extract-content':
        result = await simulateContentExtraction(url);
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.status(200).json({
      success: true,
      action,
      url,
      result,
      message: 'Browser automation completed successfully'
    });

  } catch (error) {
    console.error('Browser automation error:', error);
    res.status(500).json({ 
      message: 'Browser automation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function simulateOpenResource(url: string, taskId?: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    opened: true,
    taskId,
    title: `Page from ${new URL(url).hostname}`,
    timestamp: new Date().toISOString(),
    category: categorizeUrl(url)
  };
}

async function simulateFocusTracking(url: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    focusPercentage: Math.floor(Math.random() * 30) + 70,
    distractionPercentage: Math.floor(Math.random() * 30),
    timeSpent: Math.floor(Math.random() * 300) + 60,
    title: `Page from ${new URL(url).hostname}`,
    category: categorizeUrl(url)
  };
}

async function simulateContentExtraction(url: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    title: `Content from ${new URL(url).hostname}`,
    summary: 'AI-extracted content summary would appear here',
    keyPoints: ['Point 1', 'Point 2', 'Point 3'],
    relevance: Math.floor(Math.random() * 5) + 6
  };
}

function categorizeUrl(url: string): 'productive' | 'distracting' | 'neutral' {
  const productiveDomains = ['github.com', 'stackoverflow.com', 'developer.mozilla.org', 'docs.google.com', 'medium.com'];
  const distractingDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'tiktok.com'];
  
  const hostname = new URL(url).hostname;
  
  if (productiveDomains.some(domain => hostname.includes(domain))) {
    return 'productive';
  } else if (distractingDomains.some(domain => hostname.includes(domain))) {
    return 'distracting';
  } else {
    return 'neutral';
  }
} 