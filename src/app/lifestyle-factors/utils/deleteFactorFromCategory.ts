import { LifestyleCategory } from "../page";

export const deleteFactorFromCategory = async (
  categoryIndex: number, 
  lifestyle_factor_id: number | null, 
  nano_id: string,
  lifestyleFactors: LifestyleCategory[]
) => {

  try {
  
    const newLifestyleFactors = [...lifestyleFactors];

    const factorToDelete = newLifestyleFactors[categoryIndex].factors.find(data => data.lifestyle_factor_id === lifestyle_factor_id)

    const deleteFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factorToDelete)
    })

    if(!deleteFactor.ok) return false

    newLifestyleFactors[categoryIndex].factors = newLifestyleFactors[categoryIndex].factors.filter(factor => factor.nano_id !== nano_id);
    
    return newLifestyleFactors

  } catch (err) {
    
    console.error('Error deleting factor from category', err);

    return null;
  }

}