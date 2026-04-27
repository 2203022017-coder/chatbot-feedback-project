"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// PostgreSQL bağlantı havuzu (Pool)
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Bağlantı sağlandığında konsola yazdır
pool.on('connect', () => {
    console.log('✅ PostgreSQL veritabanına bağlantı başarılı.');
});
exports.default = pool; // chatController.ts buradan 'pool' ismini çekiyor
