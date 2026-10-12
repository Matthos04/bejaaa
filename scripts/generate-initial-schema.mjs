// Initial migration generation through Drizzle's API avoids the tsx CLI's
// Windows userInfo call in restricted desktop execution environments.
import fs from 'node:fs';
import {generateSQLiteDrizzleJson,generateSQLiteMigration} from 'drizzle-kit/api';
import * as schema from '../db/schema.ts';
const journalPath='drizzle/meta/_journal.json';
const journal=JSON.parse(fs.readFileSync(journalPath,'utf8'));
if(journal.entries.length)throw Error('Initial schema already generated. Use db:generate for later changes.');
const empty=await generateSQLiteDrizzleJson({});
const snapshot=await generateSQLiteDrizzleJson(schema,empty.id);
const statements=await generateSQLiteMigration(empty,snapshot);
fs.writeFileSync('drizzle/0000_beja.sql',statements.join('\n--> statement-breakpoint\n')+'\n');
fs.writeFileSync('drizzle/meta/0000_snapshot.json',JSON.stringify(snapshot,null,2));
journal.entries.push({idx:0,version:'6',when:Date.now(),tag:'0000_beja',breakpoints:true});
fs.writeFileSync(journalPath,JSON.stringify(journal,null,2));
console.log('Generated',statements.length,'schema statements.');
