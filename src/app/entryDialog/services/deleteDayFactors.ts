export const deleteDailyFactors = async ( user_id: number, daily_entry_id: number ) => {

  const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/entry-factor`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id,
      daily_entry_id,
    })
  });

  const deletedFactorsFromDailyEntry = await fetchDelete.json();

  if(deletedFactorsFromDailyEntry.length > 0) {

    return deletedFactorsFromDailyEntry;
    
  }
  return null
  
};