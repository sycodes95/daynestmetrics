import { LifestyleCategory } from "@/types/lifestyleFactors";

export const updateLifestyleFactors = (categoryIndex: number, nano_id: string, value: string, lifestyleFactors: LifestyleCategory[]) => {
  const newLifestyleFactors = [...lifestyleFactors];

  const factor = newLifestyleFactors[categoryIndex].factors.find(f => f.nano_id === nano_id);

  if(factor) factor.name = value;
  return newLifestyleFactors
  
};