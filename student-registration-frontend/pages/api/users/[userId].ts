import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { userId },
    method,
  } = req;

  if (method !== 'GET') {
     res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
    
  }

  try {
    // Forward the request to the backend API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;
    const authHeader = req.headers.authorization;
    const response = await axios.get(backendUrl, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });
  return res.status(response.status).json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: 'Internal server error' };
     return res.status(status).json(data);
    } else {
     return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
