export type LifestyleCategory = { 
  user_id? : number;
  lifestyle_category_id? : number;
  name: string;
  order_position: number;
  factors: LifestyleFactor[];
};

export type LifestyleFactor = { 
  user_id : number;
  archive: boolean;
  lifestyle_factor_id: number;
  lifestyle_category_id : number;
  nano_id: string; 
  name: string; 
  created_at? : string;
};