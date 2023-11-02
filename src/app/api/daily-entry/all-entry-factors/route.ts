import { NextResponse } from 'next/server';
const db = require('../../../../db/db')


export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")

  const queryParams = [user_id]

  const result = await db.query(`SELECT * FROM daily_entry_factor 
  WHERE user_id = $1`
  , queryParams);

  console.log(result);
  return NextResponse.json(result.rows)
};