import { NextResponse } from 'next/server';
const db = require('../../../db/db')

export async function GET(req: Request){
  const url = new URL(req.url)
  const user_id = url.searchParams.get("user_id")
  const queryParams = [user_id]

  const categoriesQuery = `
    SELECT l.lifestyle_category_id, l.order_position AS category_order, l2.factor, l2.order_position AS factor_order 
    FROM lifestyle_category l 
    LEFT JOIN lifestyle_factor l2 ON l.lifestyle_category_id = l2.lifestyle_category_id 
    WHERE l.user_id = $1 
    ORDER BY l.order_position, l2.order_position;
  `;

  const result = await db.query(categoriesQuery, queryParams);

  if(result.length > 1) return NextResponse.json(null)

  const combinedArr = [];
  let currentCategoryId = null;
  let currentCategory = null;

  result.rows.forEach(row => {
    if(currentCategoryId !== row.lifestyle_category_id) {
      currentCategoryId = row.lifestyle_category_id;
      currentCategory = {
        categoryId: row.lifestyle_category_id,
        order_position: row.category_order,
        factors: []
      }
    }

    if(row.factor) {
      currentCategory.factors.push({
        factor: row.factor,
        order: row.factor_order,
        nano_id : row.nano_id
      })
    }
  });

  console.log(combinedArr);
  return NextResponse.json(combinedArr)
};

// export async function PUT(req: Request){
//   const lifestyle_category = await req.json()
//   const url = new URL(req.url)
//   const user_id = url.searchParams.get("user_id")
//   const queryText = `SELECT * FROM lifestyle_category WHERE user_id = $1 AND order_position = $2`
//   const queryParams = [user_id, lifestyle_category.order_position]

//   const result = await db.query(queryText, queryParams);

//   if(result.rows.length > 0) {
//     const updateQuery = `
//     UPDATE lifestyle_category 
//     SET category = $1 
//     WHERE order_position = $2 AND user_id = $3 
//     RETURNING *
//     `;

//     const updateParams = [lifestyle_category.category, lifestyle_category.order_position, user_id]

//     const result = await db.query(updateQuery, updateParams)
//   } else if(result.rows.length === 0) {
//     const insertQuery = `
//     UPDATE lifestyle_category 
//     SET category = $1 
//     WHERE order_position = $2 AND user_id = $3 
//     RETURNING *
//     `;
//   }

// };
