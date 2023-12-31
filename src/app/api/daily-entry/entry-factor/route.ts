import { NextResponse } from 'next/server';
const db = require('../../../../db/db')


export async function GET(req: Request){
  const url = new URL(req.url)
  const daily_entry_id = url.searchParams.get("daily_entry_id")
  const user_id = url.searchParams.get("user_id")

  const queryParams = [daily_entry_id, user_id]

  const result = await db.query(`SELECT * FROM daily_entry_factor 
  WHERE daily_entry_id = $1 AND user_id = $2`
  , queryParams);

  return NextResponse.json(result.rows)
};

export async function POST(req: Request) {
  const {
    daily_entry_id,
    lifestyle_factor_id,
    user_id,
    did
  } = await req.json();

  const insertText = `INSERT INTO daily_entry_factor 
  (daily_entry_id, lifestyle_factor_id, user_id, did) 
  VALUES ($1, $2, $3, $4) 
  RETURNING*`

  const insertParams = [
    daily_entry_id,
    lifestyle_factor_id,
    user_id,
    did
  ];

  const result = await db.query(insertText, insertParams);

  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null);

}

export async function DELETE(req: Request) {
  const {
    daily_entry_id,
    lifestyle_factor_id,
    user_id
  } = await req.json();

  const deleteText = `DELETE FROM daily_entry_factor 
  WHERE daily_entry_id = $1 AND user_id = $2 
  RETURNING*`

  const deleteParams = [
    daily_entry_id,
    user_id
  ];

  const result = await db.query(deleteText, deleteParams);

  return NextResponse.json(result.rows.length > 0 ? result.rows : null);

}

