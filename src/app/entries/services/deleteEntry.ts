
export const deleteEntry = async (user_id: number, entry_date: string) => {
  try {

    const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/entry`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        entry_date,
      })
    })
    
    const deletedData = await fetchDelete.json()
    return deletedData

  } catch (error) {
    console.error('error deleting entry', error)
  }
  
}