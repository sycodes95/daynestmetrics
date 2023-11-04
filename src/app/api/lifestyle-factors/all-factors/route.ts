import { LifestyleFactor } from '@/types/lifestyleFactors';
import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryText = `SELECT * FROM lifestyle_factor WHERE user_id = $1`
  const queryParams = [user_id]

  const result = await db.query(queryText, queryParams)
  return NextResponse.json(result.rows)
}
