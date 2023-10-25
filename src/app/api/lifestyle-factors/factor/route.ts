import { LifestyleFactor } from '@/app/lifestyle-factors/page';
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

export async function PATCH(req: Request){
  const lifestyle_factor : LifestyleFactor = await req.json()
  // const url = new URL(req.url)
  // const user_id = url.searchParams.get("user_id")
  const updateText = `UPDATE lifestyle_factor 
  SET name = $1 
  WHERE user_id = $1 AND lifestyle_factor_id = $2 
  RETURNING*`

  const updateParams = [
    lifestyle_factor.name,
    lifestyle_factor.user_id,
    lifestyle_factor.lifestyle_factor_id
  ];
  const result = await db.query(updateText, updateParams)
  console.log(result.rows);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

};

export async function POST(req: Request){
  const lifestyle_factor : LifestyleFactor = await req.json()
  console.log(lifestyle_factor);
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const insertText = `INSERT INTO lifestyle_factor 
  (lifestyle_category_id, user_id, nano_id, name, order_position)
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING*`

  const insertParams = [
    lifestyle_factor.lifestyle_category_id,
    lifestyle_factor.user_id,
    lifestyle_factor.nano_id,
    lifestyle_factor.name,
    lifestyle_factor.order_position,
  ];
  const result = await db.query(insertText, insertParams)
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

};

export async function DELETE(req: Request){
  const lifestyle_factor : LifestyleFactor = await req.json()
  // const url = new URL(req.url)
  // const user_id = url.searchParams.get("user_id")
  const deleteText = `DELETE FROM lifestyle_factor 
  WHERE user_id = $1 AND lifestyle_factor_id = $2 
  RETURNING*`

  const deleteParams = [
    lifestyle_factor.user_id,
    lifestyle_factor.lifestyle_factor_id,
  ];
  const result = await db.query(deleteText, deleteParams)
  console.log(result.rows);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

};
