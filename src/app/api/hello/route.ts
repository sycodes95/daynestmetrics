import type { NextApiRequest, NextApiResponse } from 'next'
const db = require('../../../db/db')
export async function GET(req: Request){
  const result = await db.query('SELECT * FROM users');
  console.log(result.rows);
  return new Response(process.env.AUTH0_DOMAIN);
};

