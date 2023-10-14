import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
const db = require('../../../db/db')


export async function GET(req: Request, res: Response){
  const result = await db.query('SELECT * FROM users');
  return NextResponse.json(result.rows)
};

export async function POST(req: Request, res: Response){
  const result = await db.query('SELECT * FROM users');
  return NextResponse.json(result.rows)
};

