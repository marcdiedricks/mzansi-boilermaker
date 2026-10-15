#!/usr/bin/env node
// Read-only static audit of the candidate Netlify publish directory.
// Run: node scripts/audit-public-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('public');
const failures=[];
const warnings=[];
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.isFile())files.push(path.relative(root,full).replaceAll(path.sep,'/'));}}
if(!fs.existsSync(root)){console.error('FAIL: public/ missing');process.exit(1);}
walk(root);
const exists=new Set(files);
function verify(from,url,kind){
 if(/^(?:https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(url))return;
 const clean=url.split(/[?#]/)[0];if(!clean)return;
 if(clean==='.'||clean==='./'||clean==='/'){if(!exists.has('index.html'))failures.push(from+': homepage index.html missing');return;}
 const target=clean.startsWith('/')?clean.slice(1):path.posix.normalize(path.posix.join(path.posix.dirname(from),clean));
 if(target.startsWith('../')){failures.push(from+': path escapes public/: '+url);return;}
 if(!exists.has(target)&&!exists.has(target+'/index.html'))failures.push(from+': missing '+kind+' '+url+' (resolved '+target+')');
}
for(const f of files.filter(f=>f.endsWith('.html'))){
 const s=fs.readFileSync(path.join(root,f),'utf8');
 for(const m of s.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi))verify(f,m[1],'HTML reference');
}
for(const sw of ['service-worker.js','sw.js'].filter(x=>exists.has(x))){
 const s=fs.readFileSync(path.join(root,sw),'utf8');
 const arr=s.match(/(?:APP_SHELL|ASSETS)\s*=\s*\[([\s\S]*?)\]/);
 if(!arr){warnings.push(sw+': cache array not statically identified');continue;}
 for(const m of arr[1].matchAll(/["']([^"']+)["']/g))verify(sw,m[1],'offline cache');
}
for(const manifest of files.filter(x=>x.endsWith('.webmanifest'))){
 try{const data=JSON.parse(fs.readFileSync(path.join(root,manifest),'utf8'));for(const icon of data.icons||[])if(icon.src)verify(manifest,icon.src,'manifest icon');if(data.start_url)verify(manifest,data.start_url,'start URL');}
 catch(e){failures.push(manifest+': invalid JSON '+e.message);}
}
for(const p of ['index.html','manifest.webmanifest','service-worker.js'])if(!exists.has(p))failures.push('Required PWA file missing: '+p);
console.log('Candidate files:',files.length,'HTML pages:',files.filter(x=>x.endsWith('.html')).length);
for(const w of warnings)console.warn('WARN:',w);
for(const f of failures)console.error('FAIL:',f);
console.log(failures.length?'STATIC AUDIT FAILED: '+failures.length+' issue(s)':'STATIC AUDIT PASSED (not a browser/offline test)');
process.exitCode=failures.length?1:0;
