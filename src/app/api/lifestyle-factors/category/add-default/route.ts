import { NextResponse } from 'next/server';
const db = require('../../../../../db/db')

export async function POST(req: Request){
  const { user_id } = await req.json()
  const defaultCategories = Array.from({ length: 12 }, (_, index) => ({
    user_id,
    order_position: index + 1,
    name: ''
  }));


  const insertDefaultCategories = defaultCategories.map((category) => {
    const {user_id, order_position, name} = category
    const queryText = `INSERT INTO lifestyle_category (user_id, order_position, name) 
    VALUES ($1, $2, $3) RETURNING*;`
    const queryParams = [user_id, order_position, name]
    return db.query(queryText, queryParams);

  });

  const insertResults = await Promise.all(insertDefaultCategories)
  const insertedCategories = insertResults.map(result => result.rows[0]);

  return NextResponse.json(insertedCategories)

};
