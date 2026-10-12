import { isAdmin } from '@/lib/server';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="container empty"><h1>این بخش مخصوص مدیر به‌جاست.</h1><p>با حساب مدیر وارد شوید.</p><a className="button" href="/signout-with-chatgpt?return_to=/admin" target="_top">خروج و تغییر حساب</a></main>;return <Admin/>}
