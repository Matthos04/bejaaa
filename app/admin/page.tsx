import { isAdmin } from '@/lib/server';
import { redirect } from 'next/navigation';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){if(!await isAdmin())redirect('/admin/login');return <><form action="/api/admin/logout" method="post" className="container" style={{display:'flex',justifyContent:'flex-end',paddingTop:16}}><button className="text-link" type="submit">خروج از پنل</button></form><Admin/></>}
