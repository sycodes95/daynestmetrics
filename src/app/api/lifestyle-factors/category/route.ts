import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryText = `SELECT * FROM lifestyle_category WHERE user_id = $1`
  const queryParams = [user_id]

  const result = await db.query(queryText, queryParams)
  return NextResponse.json(result.rows)
}

export async function PUT(req: Request){
  const lifestyle_category = await req.json()
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryText = `SELECT * FROM lifestyle_category WHERE user_id = $1 AND order_position = $2`
  const queryParams = [user_id, lifestyle_category.order_position]

  const result = await db.query(queryText, queryParams);

  if(result.rows.length > 0) {
    const updateQuery = `
    UPDATE lifestyle_category 
    SET name = $1 
    WHERE order_position = $2 AND user_id = $3 
    RETURNING *
    `;

    const updateParams = [lifestyle_category.name, lifestyle_category.order_position, user_id]

    const result = await db.query(updateQuery, updateParams)

    return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

  } else if(result.rows.length === 0) {
    const insertQuery = `
    INSERT INTO lifestyle_category (user_id, name, order_position) 
    VALUES ($1, $2, $3) 
    RETURNING *
    `;

    const insertParams = [user_id, lifestyle_category.name, lifestyle_category.order_position]

    const result = await db.query(insertQuery, insertParams)

    return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

  }

  return NextResponse.json(null)

};
