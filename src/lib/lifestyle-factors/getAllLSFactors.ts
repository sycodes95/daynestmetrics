import { LifestyleFactor } from "@/types/lifestyleFactors"

export const getAllLSFactors = async (user_id: number): Promise<LifestyleFactor[]> => {

  try {
    const fetchGetAll = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/all-factors?user_id=${user_id}`)

    const lsFactors = await fetchGetAll.json()

    return lsFactors
    
  } catch (error) {

    console.error(error)

    return []
  }
  
}