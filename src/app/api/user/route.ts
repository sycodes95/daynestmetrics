import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
const db = require('../../../db/db')


export async function GET(req: Request){
  const url = new URL(req.url)
  const sub = url.searchParams.get("sub")
  const result = await db.query('SELECT * FROM users WHERE sub = $1', [sub]);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)
};

export async function PATCH(req: Request, res: Response){
  const user = await req.json()

  let queryText = `UPDATE users SET `;
  let queryParams: any[] = [];

  Object.keys(user).forEach((key: string, index) => {

    if(index !== 0) queryText += `, `;
    queryText += `${key} = $${index + 1}`;
    queryParams.push(user[key]);
    
  });

  queryText += ` WHERE sub = $${queryParams.findIndex(el => el === user.sub) + 1} RETURNING *`;

  const result = await db.query(queryText, queryParams);

  return NextResponse.json(result);

};

export async function POST(req: Request){
  
  const user = await req.json()

  let queryParams: any = []

  let insertFields = ``
  let insertValues = ``

  Object.keys(user).forEach((key, index) => {
    //populate insertFields, insertValues, query Params with User object
    if(index < (Object.keys(user).length - 1)) {
      insertFields += `${key}, `
      insertValues += `$${index + 1}, `
    } else {
      insertFields += `${key}`
      insertValues += `$${index + 1}`
    }

    queryParams.push(user[key])

  })
  let queryText = `INSERT INTO users (${insertFields}) VALUES(${insertValues}) RETURNING *`

  const result = await db.query(queryText, queryParams);

  return NextResponse.json(result.rows)
};
