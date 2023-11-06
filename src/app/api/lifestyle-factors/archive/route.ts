import { LifestyleFactor } from '@/types/lifestyleFactors';
import { NextResponse } from 'next/server';
const db = require('../../../../db/db')

export async function PATCH(req: Request){
  const lifestyle_factor : LifestyleFactor = await req.json()
  const updateText = `UPDATE lifestyle_factor 
  SET archive = $1 
  WHERE user_id = $2 AND lifestyle_factor_id = $3 
  RETURNING*`

  const updateParams = [
    lifestyle_factor.archive,
    lifestyle_factor.user_id,
    lifestyle_factor.lifestyle_factor_id
  ];
  const result = await db.query(updateText, updateParams)
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)

};