export const updateCategory = async (name : string, lifestyle_category_id: number, user_id: number) => {
  try {
    const patch = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category`, {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        name,
        lifestyle_category_id,
        user_id
      })
    })
    const updatedCategory = await patch.json()
    if(updatedCategory) return updatedCategory
    return null
  } catch (error) {
    console.error('Error patching category', error)
    return null
    
  }

}