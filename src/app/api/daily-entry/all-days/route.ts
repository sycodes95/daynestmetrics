import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryParams = [user_id]

  const result = await db.query('SELECT * FROM daily_entry WHERE user_id = $1', queryParams);
  return NextResponse.json(result.rows.length > 0 ? result.rows : null)
};


// I THINK I HAVE TO USE REDUX, MAYBE NOT IDK LEMME SEE