import { DailyEntryFactor } from "@/types/dailyEntryFactor";
import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors";

export const formatFactors = (dailyEntryFactors : DailyEntryFactor[], lifestyleFactors: LifestyleCategory[]) => {
  const didFactors: LifestyleFactor[]  = []
  const didNotFactors: LifestyleFactor[] = []
  
  dailyEntryFactors.forEach((dailyFactor) => {

    const lifestyleFactorCateogory = lifestyleFactors.find(category => category.factors.find(f => f.lifestyle_factor_id === dailyFactor.lifestyle_factor_id))

    if(lifestyleFactorCateogory) {

      const lifestyleFactor = lifestyleFactorCateogory.factors.find(factor => factor.lifestyle_factor_id === dailyFactor.lifestyle_factor_id)
      
      dailyFactor.did && lifestyleFactor && didFactors.push(lifestyleFactor)

      !dailyFactor.did && lifestyleFactor && didNotFactors.push(lifestyleFactor)
    }

  })

  return {
    did: didFactors,
    didNot : didNotFactors
  }

}