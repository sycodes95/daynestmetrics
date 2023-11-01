import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

  const queryParams = [oneMonthAgoStr, todayStr, user_id];

  const result = await db.query('SELECT * FROM daily_entry WHERE entry_date BETWEEN $1 AND $2 AND user_id = $3 ORDER BY entry_date ASC', queryParams);
  return NextResponse.json(result.rows)
};