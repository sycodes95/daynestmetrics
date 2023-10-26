import { LifestyleCategory } from "../page";

export const updateFactorPG = async (categoryIndex: number, nano_id: string, lifestyleFactors: LifestyleCategory[] ) => {

  try {

    const factorToPatch = lifestyleFactors[categoryIndex].factors.find(data => data.nano_id === nano_id);

    if(!factorToPatch) return false;

    const patchFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factorToPatch)
    });

    if(patchFactor.ok) {
      return true
    }
    return false

  } catch(err) {

    console.error('Error updating factor', err)
    return false

  }
};