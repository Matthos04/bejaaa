import assert from 'node:assert/strict';
import {test} from 'node:test';
import {recommend,distance,defaultPreferences,blankCafe} from '../lib/model.ts';
import type {Cafe} from '../lib/model.ts';
const base:Cafe={...blankCafe,id:'a',name:'آزمون',status:'published',active:true,purposes:{work:'yes'},features:{wifi:'yes'}};
test('draft, inactive, unsuitable and undersized cafes cannot be recommended',()=>{const cafes=[base,{...base,id:'b',status:'draft'},{...base,id:'c',active:false},{...base,id:'d',maxGroup:1},{...base,id:'e',purposes:{work:'unknown'}}];assert.deepEqual(recommend(cafes,{...defaultPreferences,purpose:'work'}).map(x=>x.id),['a']);});
test('price and neighborhood stay hard constraints',()=>{assert.equal(recommend([base],{...defaultPreferences,price:3}).length,0);assert.equal(recommend([base],{...defaultPreferences,neighborhood:'تجریش'}).length,0);});
test('preferences rank verified features above unknown features',()=>{const other={...base,id:'b',features:{wifi:'unknown'}};assert.deepEqual(recommend([other,base],{...defaultPreferences,features:['wifi']}).map(x=>x.id),['a','b']);assert.ok(!recommend([other],{...defaultPreferences,features:['wifi']})[0].reasons.includes('اینترنت'));});
test('radius uses geographic distance',()=>{assert.equal(distance([35.7,51.4],[35.7,51.4]),0);assert.equal(recommend([base],{...defaultPreferences,center:[35.9,51.4],radius:1}).length,0);});
