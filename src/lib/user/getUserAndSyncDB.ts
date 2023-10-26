import { Claims, getSession } from "@auth0/nextjs-auth0";

export const getUserAndSyncDB = async (user: Claims | null) => {
  //syncs user object from auth0 with user from sql db
  //if user doesn't exist in db, then it creates it using POST
  
  if(user) {
    const getUserFromPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user?sub=${user.sub}`)
    .then(res => res.json())
    if(getUserFromPG){
      const userAuth0KeyValues = Object.entries(user) 
      const userPGKeyValues = Object.entries(getUserFromPG) 

      let auth0AndPGIsSynced = true;
      for(let i = 0; i < userPGKeyValues.length; i++) {
        if(!userAuth0KeyValues[i]) break;
        if(userAuth0KeyValues[i][1] !== userPGKeyValues[i + 1][1] ){
          auth0AndPGIsSynced = false;
          break;
        }  
      } 

      if(!auth0AndPGIsSynced){
        await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
      } 

    } else {
      await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    }
    
  }
}