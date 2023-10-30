import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const entry_date = url.searchParams.get("entry_date")
  const user_id = url.searchParams.get("user_id")
  const queryParams = [entry_date, user_id]

  const result = await db.query('SELECT * FROM daily_entry WHERE entry_date = $1 AND user_id = $2', queryParams);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)
};

export async function PUT(req: Request){
  const daily_entry = await req.json()
  const {
    user_id,
    entry_date,
    mood_rating,
    productivity_rating,
    journal
  } = daily_entry

  const checkIfEntryExist = await db.query(
    `SELECT * FROM daily_entry WHERE entry_date = $1 AND user_id = $2`,
    [entry_date, user_id] 
    )

  if(checkIfEntryExist.rows.length > 0) {
    const updateText = `UPDATE daily_entry 
    SET mood_rating = $1, productivity_rating = $2, journal = $3 
    WHERE user_id = $4 AND entry_date = $5 
    RETURNING*`

    const updateParams = [
      mood_rating,
      productivity_rating,
      journal,
      user_id,
      entry_date
    ]

    const result = await db.query(
      updateText,
      updateParams
    )
    
    return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

  } else {
    const insertText = `INSERT INTO daily_entry 
    (user_id, entry_date, mood_rating, productivity_rating, journal) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING*`

    const insertParams = [
      user_id,
      entry_date,
      mood_rating,
      productivity_rating,
      journal
    ]

    const result = await db.query(
      insertText,
      insertParams
    )

    return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)
  }

};

export async function DELETE(req: Request){
  const daily_entry = await req.json()
  const {
    user_id,
    entry_date,
    mood_rating,
    productivity_rating,
    journal
  } = daily_entry

  const deleteText = `DELETE FROM daily_entry 
  WHERE daily_entry_id = $1 AND user_id = $2 
  RETURNING*`


};
