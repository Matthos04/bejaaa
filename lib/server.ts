import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export function db(){if(!env.DB)throw new Error('پایگاه داده در دسترس نیست.');return env.DB;}
export async function isAdmin(){const u=await getChatGPTUser();const admin=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return !!(u&&admin&&u.email.toLowerCase()===admin.toLowerCase());}
export function checkOrigin(req:Request){const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)throw new Error('درخواست نامعتبر است.');}
export function fail(message:string,status=400){return Response.json({error:message},{status});}
