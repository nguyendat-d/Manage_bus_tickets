const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mysql = require('mysql2/promise');

function readEnv(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function prompt(question, silent) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (!silent) {
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
  }
  // silent input (no echo)
  return new Promise(resolve => {
    process.stdout.write(question);
    const stdin = process.openStdin();
    let input = '';
    const onData = char => {
      char = char + '';
      switch (char) {
        case '\n': case '\r': case '\u0004':
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(input);
          break;
        case '\u0003':
          process.exit();
          break;
        default:
          process.stdout.write('*');
          input += char;
          break;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  const scriptDir = path.resolve(__dirname);
  const repoRoot = path.resolve(scriptDir, '..', '..', '..');
  const envPath = path.join(repoRoot, '.env');
  const sqlPath = path.join(repoRoot, 'scripts', 'create_database.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found:', sqlPath);
    process.exit(1);
  }

  const env = readEnv(envPath);
  const dbName = env.DB_NAME || 'bookingdb';
  const dbUser = env.DB_USER || 'appuser';
  const dbPass = env.DB_PASS || 'apppassword';
  const dbHost = env.DB_HOST || '127.0.0.1';

  console.log('Using DB settings from .env (if present):');
  console.log(' DB_NAME=', dbName);
  console.log(' DB_USER=', dbUser);
  console.log(' DB_HOST=', dbHost);

  const rootUser = (await prompt('MySQL admin user (default root): ')).trim() || 'root';
  const rootPass = await prompt('Password for ' + rootUser + ': ', true);

  const sql = fs.readFileSync(sqlPath, 'utf8');

  let conn;
  try {
    conn = await mysql.createConnection({ host: dbHost, user: rootUser, password: rootPass, multipleStatements: true });
  } catch (err) {
    console.error('Failed to connect to MySQL:', err.message || err);
    process.exit(1);
  }

  try {
    console.log('Executing SQL...');
    await conn.query(sql);
    console.log('SQL executed successfully. Database and user should be created/updated.');
  } catch (err) {
    console.error('Error executing SQL:', err.message || err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
