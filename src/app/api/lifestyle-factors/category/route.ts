import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryText = `SELECT * FROM lifestyle_category WHERE user_id = $1 ORDER BY created_at DESC`
  const queryParams = [user_id]

  const result = await db.query(queryText, queryParams)
  return NextResponse.json(result.rows)
}

export async function PATCH(req: Request) {
  const { 
    user_id, 
    lifestyle_category_id, 
    name 
  } = await req.json()

  const updateQuery = `
  UPDATE lifestyle_category 
  SET name = $1 
  WHERE lifestyle_category_id = $2 AND user_id = $3 
  RETURNING *
  `;

  const updateParams = [
    name,
    lifestyle_category_id,
    user_id
  ]

  const result = await db.query(updateQuery, updateParams)

  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

}


