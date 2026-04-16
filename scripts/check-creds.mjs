import fs from 'fs';
const lines = fs.readFileSync('.env.local', 'utf-8').split('\n');
const env = {};
for (const line of lines) {
  const i = line.indexOf('=');
  if (i > 0 && line[0] !== '#') {
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    env[k] = v;
  }
}
const key = env['GEMINI_API_KEY'] ?? '';
const cred = env['GOOGLE_APPLICATION_CREDENTIALS_JSON'] ?? '';
console.log('GEMINI_API_KEY type:', key.startsWith('AIza') ? 'AI Studio OK' : key.startsWith('AQ.') ? 'Vertex Express OK' : key ? 'UNKNOWN: ' + key.slice(0,10) : 'NOT SET');
console.log('SERVICE_ACCOUNT:', cred ? 'SET (' + cred.length + ' chars)' : 'NOT SET');
console.log('VERTEX_PROJECT:', env['VERTEX_PROJECT_ID'] ?? 'not set');
console.log('VERTEX_LOCATION:', env['VERTEX_LOCATION'] ?? 'not set');
