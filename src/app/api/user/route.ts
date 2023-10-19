import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
const db = require('../../../db/db')


export async function GET(req: Request){
  const url = new URL(req.url)
  const sub = url.searchParams.get("sub")
  const result = await db.query('SELECT * FROM users WHERE sub = $1', [sub]);
  console.log(result);
  return NextResponse.json(result.rows.length > 0 ? result.rows[0] : null)
};

export async function PATCH(req: Request, res: Response){
  const user = await req.json()

  let queryText = `UPDATE users SET `;
  let queryParams: any[] = [];
  let queryParamsSubIndex;

  Object.keys(user).forEach((key: string, index) => {
    
    if(key !== 'sub') {

      if(index !== 0) queryText += `, `;
      queryText += `${key} = $${index + 1}`;
      queryParams.push(user[key]);

    }

    if(key === 'sub') {
      queryParamsSubIndex = index + 1;
    }
  });

  queryParams.push(user.sub);

  queryText += ` WHERE sub = $${queryParamsSubIndex} RETURNING *`;

  const result = await db.query(queryText, queryParams);

  return NextResponse.json(result);

};

export async function POST(req: Request){
  // const user: any = {
  //   given_name: 'kevin',
  //   family_name: 'kim',
  //   nickname: 'sycodes95',
  //   name: 'kevin kim',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKJean0weqCYdFMxUwk8sdKQrOpcubBhJiuXyLkRkVA=s96-c',
  //   locale: 'en',
  //   updated_at: '2023-10-19T07:13:47.063Z',
  //   email: 'sycodes95@gmail.com',
  //   email_verified: true,
  //   sub: 'google-oauth2|118079549852150521550',
  //   sid: 'Bcz7dwG9F2eJqrx2aRyXjbLLpYc2FgKP'
  // }
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

//its working :D