import { Claims, getSession } from "@auth0/nextjs-auth0";

type User = {
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
}
export const getUser = async ()  => {
  const session = await getSession();
  const user = session?.user;
  if(user) {
    return user
  } 
  return null
}