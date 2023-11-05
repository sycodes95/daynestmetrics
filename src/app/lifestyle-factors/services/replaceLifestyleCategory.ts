import { LifestyleCategory } from "../page";

export const updateLifestyleCategory = (categoryIndex: number, value: string, lifestyleFactors: LifestyleCategory[]) => {

  const newLifestyleFactors = [...lifestyleFactors];

  const newFactors = [...newLifestyleFactors[categoryIndex].factors]

  newLifestyleFactors[categoryIndex] = { name: value, order_position: categoryIndex, factors: newFactors};

  return newLifestyleFactors

}