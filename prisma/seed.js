require('dotenv').config();
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const { DATABASE_URL } = process.env;

function parseDatabaseUrl(url) {
  const match = url.match(
    /^postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)/
  );
  if (!match) throw new Error('❌ Invalid DATABASE_URL format');

  const [, user, password, host, port, dbName] = match;
  return { user, password, host, port, dbName };
}  

async function ensureDatabaseExists() {
  const { host, port, user, password, dbName } = parseDatabaseUrl(DATABASE_URL);

  if (!user || !host || !dbName) {
    console.warn('⚠️ Skipping DB check: missing DB connection details.');
    return;
  }

  const client = new Client({
    user,
    password,
    host,
    port,
    database: 'postgres', // Always connect to the default DB
  });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      console.log(`📦 Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`⚠️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.warn('❌ Error ensuring database exists:', err.message);
  } finally {
    await client.end();
  }
}

async function runPrismaGenerate() {
  try {
    console.log('⚙️ Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated.');
  } catch (err) {
    console.error('❌ Error generating Prisma Client:', err.message);
    process.exit(1);
  }
}

function runPrismaGenerate() {
  try {
    console.log('⚙️ Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated.');
  } catch (err) {
    console.error('❌ Error generating Prisma Client:', err.message);
    process.exit(1);
  }
}

function runMigrations() {
  try {
    console.log('📄 Running migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations applied.');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

(async () => {
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL missing in .env');
    process.exit(1);
  }

  ensureDatabaseExists();
  runPrismaGenerate();
  runMigrations();
})();
