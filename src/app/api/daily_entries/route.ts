import { NextResponse } from 'next/server';
const db = require('../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const entry_date = url.searchParams.get("entry_date")
  const user_id = url.searchParams.get("user_id")
  const queryParams = [entry_date, user_id]

  const result = await db.query('SELECT * FROM daily_entries WHERE entry_date = $1 AND user_id = $2', queryParams);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)
};

export async function POST(req: Request){
  const daily_entry = await req.json()
};
