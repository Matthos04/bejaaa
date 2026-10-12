import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='http://127.0.0.1:5173';
const login=await fetch(base+'/signin-with-chatgpt?return_to=/admin',{redirect:'manual'});
const cookie=login.headers.get('set-cookie')?.split(';')[0];
assert.ok(cookie,'Local preview sign-in cookie');
const headers={'Content-Type':'application/json',Origin:base,Cookie:cookie};
const anon=await fetch(base+'/api/cafes',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:'{}'});assert.equal(anon.status,403);
const forbidden=await fetch(base+'/api/cafes',{method:'POST',headers:{...headers,Origin:'https://other.example'},body:'{}'});assert.ok([400,403].includes(forbidden.status));
const fd=new FormData();fd.set('file',new File([fs.readFileSync('public/images/brand.png')],'test.png',{type:'image/png'}));
const upload=await fetch(base+'/api/upload',{method:'POST',headers:{Cookie:cookie,Origin:base},body:fd});assert.equal(upload.status,200,await upload.clone().text());const image=await upload.json();
const payload={name:'کافهٔ آزمون محلی',neighborhood:'ولیعصر',address:'آدرس آزمایشی برای بررسی ثبت کافه',description:'صرفاً آزمون محلی',lat:35.7219,lng:51.405,price:2,maxGroup:4,purposes:{work:'yes',date:'unknown'},features:{wifi:'yes'},images:[image.url],phone:'',instagram:'',hours:'۸ تا ۲۳',active:true,status:'published'};
const saved=await fetch(base+'/api/cafes',{method:'POST',headers,body:JSON.stringify(payload)});assert.equal(saved.status,200,await saved.clone().text());const c=await saved.json();fs.writeFileSync('.sites-runtime/test-cafe-id.txt',c.id);
assert.ok((await (await fetch(base+'/api/cafes')).json()).some(x=>x.id===c.id));
const review={cafeId:c.id,name:'آزمون',rating:4,body:'این متن برای بررسی مسیر ثبت و تأیید نظر است.',purpose:'work',website:''};
const submitted=await fetch(base+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(review)});assert.equal(submitted.status,200,await submitted.clone().text());
assert.equal((await (await fetch(base+'/api/reviews?cafeId='+c.id)).json()).length,0);
const pending=await (await fetch(base+'/api/reviews?admin=1',{headers:{Cookie:cookie}})).json();const row=pending.find(r=>r.cafe_id===c.id);assert.equal(row.status,'pending');
const approve=await fetch(base+'/api/reviews',{method:'PATCH',headers,body:JSON.stringify({id:row.id,status:'approved'})});assert.equal(approve.status,200);
assert.equal((await (await fetch(base+'/api/reviews?cafeId='+c.id)).json()).length,1);
const all=await (await fetch(base+'/api/cafes')).json();assert.equal(all.find(x=>x.id===c.id).rating,4);
for(let n=0;n<2;n++){const r=await fetch(base+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(review)});assert.equal(r.status,200);}
const limited=await fetch(base+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(review)});assert.equal(limited.status,429);
const archived=await fetch(base+'/api/cafes',{method:'POST',headers,body:JSON.stringify({...payload,id:c.id,status:'draft'})});assert.equal(archived.status,200);assert.ok(!(await (await fetch(base+'/api/cafes')).json()).some(x=>x.id===c.id));
fs.writeFileSync('.sites-runtime/cleanup-tests.sql',`DELETE FROM reviews WHERE cafe_id='${c.id}';\nDELETE FROM cafes WHERE id='${c.id}';\n`);
console.log('PASS: admin auth, cross-origin rejection, image upload, cafe persistence, guest reviews, moderation, rating, rate limiting, unpublishing.');

