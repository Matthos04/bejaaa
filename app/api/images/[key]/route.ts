import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const runtime = 'nodejs';
const mime:Record<string,string>={jpg:'image/jpeg',png:'image/png',webp:'image/webp'};
export async function GET(req:Request,{params}:{params:Promise<{key:string}>}){const {key}=await params;if(!/^[a-zA-Z0-9-]+\.(jpg|png|webp)$/.test(key))return new Response(null,{status:404});try{const dir=process.env.UPLOAD_DIR||path.join(process.cwd(),'data','uploads');const bytes=await readFile(path.join(dir,key));return new Response(bytes,{headers:{'Content-Type':mime[key.split('.').pop()!]||'application/octet-stream','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}});}catch{return new Response(null,{status:404});}}
