
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'HEAD' && req.method !== 'GET') {
    res.setHeader('Allow', ['HEAD', 'GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Simple health check
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
