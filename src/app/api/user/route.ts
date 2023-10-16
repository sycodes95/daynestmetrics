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
  const request = await req.json()

  // const user: {[key: string]: any} = {
  //   given_name: 'kevin',
  //   family_name: 'kim',
  //   nickname: 'sycodes95',
  //   name: 'kevin kim',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKJean0weqCYdFMxUwk8sdKQrOpcubBhJiuXyLkRkVA=s96-c',
  //   locale: 'en',
  //   updated_at: '2023-10-14T05:48:05.215Z',
  //   email: 'sycodes95@gmail.com',
  //   email_verified: true,
  //   sub: 'google-oauth2|118079549852150521550',
  //   sid: 'KPaUEnlpPRsOo38CiBffZZIw3rq11F-f'
  // }
  const user = request.body;

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

export async function POST(req: Request, res: Response){
  const result = await db.query('SELECT * FROM users');
  return NextResponse.json(result.rows)
};

