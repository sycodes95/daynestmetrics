import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function DELETE(req: Request){
  const entriesArray: number[] = await req.json();
  const deleteText = `DELETE FROM daily_entry
  WHERE daily_entry_id = ANY($1::int[]) RETURNING *;`

  const deleteQuery = [
    entriesArray
  ];

  const result = await db.query(deleteText, deleteQuery);

  return NextResponse.json(result.rows);

};
