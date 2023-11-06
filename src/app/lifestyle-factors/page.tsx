

import LifestyleFactorsHeader from "./components/lifestyleFactorsHeader/lifestyleFactorsHeader";
import LifestyleFactors from "./components/lifestyleFactors/lifestyleFactors";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser } from "@/lib/user/getUser";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { Toaster } from "@/components/ui/toaster";


export default async function page() {

  return (
   
    <div className="flex flex-col gap-8 w-full">
      
      <LifestyleFactorsHeader />
      <LifestyleFactors />
    </div>
   
  )
}
