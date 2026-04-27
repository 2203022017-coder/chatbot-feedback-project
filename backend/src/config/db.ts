// src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL bağlantı havuzu (Pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Bağlantı sağlandığında konsola yazdır
pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlantı başarılı.');
});

export default pool; // chatController.ts buradan 'pool' ismini çekiyor