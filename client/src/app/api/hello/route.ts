import type { NextApiRequest, NextApiResponse } from 'next'

export async function GET(req: Request, res: NextApiResponse){
  return res.status(200).json({ message: 'Hello!' });
};

