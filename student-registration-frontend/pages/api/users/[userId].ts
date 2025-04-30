import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;
  try {
    const response = await axios.get(backendUrl, {
      headers: req.headers, // forward auth headers if needed
      responseType: 'json',
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
  }
}
