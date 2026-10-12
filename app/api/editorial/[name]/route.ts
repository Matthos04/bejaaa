const available=new Set(['hero','interior','coffee']);
export async function GET(req:Request,{params}:{params:Promise<{name:string}>}){const {name}=await params;if(!available.has(name))return new Response(null,{status:404});return Response.redirect(new URL('/images/editorial-generated.png',req.url),302);}
