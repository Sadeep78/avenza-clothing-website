/**
 * ====================================================================
 * AVENZA CLOTHING STORE - UNIVERSAL DATABASE MODULE
 * File: backend/db.js
 * Compatible with:
 *   1. Microsoft SQL Server / SSMS (mssql)
 *   2. MySQL / XAMPP (mysql2/promise)
 * ====================================================================
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DB_TYPE = (process.env.DB_TYPE || 'mssql').toLowerCase();

// --------------------------------------------------------------------
// MS SQL SERVER CONFIGURATION (SSMS)
// --------------------------------------------------------------------
const mssqlConfig = {
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE || 'achinis_fashion_db',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || '',
  connectionTimeout: 5000,
  requestTimeout: 15000,
  options: {
    encrypt: false,               // false for local SQL Server / SSMS
    trustServerCertificate: true, // required for local dev certificates
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// --------------------------------------------------------------------
// MYSQL CONFIGURATION (XAMPP fallback)
// --------------------------------------------------------------------
const mysql = require('mysql2/promise');
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'achinis_fashion_db',
  port: parseInt(process.env.MYSQL_PORT || '3314'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --------------------------------------------------------------------
// MS SQL SERVER POOL & QUERY TRANSLATOR
// --------------------------------------------------------------------
let mssqlPool = null;
let mssqlConnecting = null;

const getMSSQLPool = async () => {
  if (mssqlPool && mssqlPool.connected) {
    return mssqlPool;
  }
  if (mssqlConnecting) {
    return mssqlConnecting;
  }

  const sql = require('mssql');
  mssqlConnecting = (async () => {
    try {
      const p = new sql.ConnectionPool(mssqlConfig);
      await p.connect();
      mssqlPool = p;
      console.log(`✅ [MS SQL SERVER] Connected successfully to "${mssqlConfig.database}" at ${mssqlConfig.server}:${mssqlConfig.port}`);
      return mssqlPool;
    } catch (err) {
      console.warn(`⚠️ [MS SQL SERVER] Connection to ${mssqlConfig.server}:${mssqlConfig.port} failed: ${err.message}`);
      console.warn(`💡 Tip: Run backend/enable_mssql_tcp.bat (as Administrator) to enable Port 1433, or execute backend/mssql_schema.sql in SSMS.`);
      mssqlPool = null;
      return null;
    } finally {
      mssqlConnecting = null;
    }
  })();

  return mssqlConnecting;
};

/**
 * Translates MySQL-flavored query strings to MS SQL Server (T-SQL)
 */
function translateQueryToMSSQL(sqlStr, params = []) {
  let translated = sqlStr;

  // 1. Replace MySQL NOW() and CURDATE()
  translated = translated.replace(/\bNOW\(\)/gi, 'GETDATE()');
  translated = translated.replace(/\bCURDATE\(\)/gi, 'CAST(GETDATE() AS DATE)');

  // 2. Replace MySQL GREATEST(0, stock - ?) with T-SQL CASE
  translated = translated.replace(/GREATEST\s*\(\s*0\s*,\s*([a-zA-Z0-9_]+)\s*-\s*\?\s*\)/gi,
    'CASE WHEN ($1 - ?) < 0 THEN 0 ELSE ($1 - ?) END');

  // 3. Translate ON DUPLICATE KEY UPDATE for system_settings
  if (/ON\s+DUPLICATE\s+KEY\s+UPDATE/i.test(translated)) {
    translated = `
      IF EXISTS (SELECT 1 FROM system_settings WHERE setting_key = @p0)
        UPDATE system_settings SET setting_value = @p1, updated_at = GETDATE() WHERE setting_key = @p0
      ELSE
        INSERT INTO system_settings (setting_key, setting_value) VALUES (@p0, @p1)
    `;
    return {
      query: translated,
      inputs: [
        { name: 'p0', value: params[0] },
        { name: 'p1', value: params[1] }
      ]
    };
  }

  // 4. Convert '?' placeholders to @p0, @p1, ...
  const inputs = [];
  let paramIndex = 0;
  
  // Note: if query had the replaced GREATEST, handle parameter duplication if any
  translated = translated.replace(/\?/g, () => {
    const pName = `p${paramIndex}`;
    const pVal = params[paramIndex] !== undefined ? params[paramIndex] : null;
    inputs.push({ name: pName, value: pVal });
    paramIndex++;
    return `@${pName}`;
  });

  return { query: translated, inputs };
}

/**
 * Universal query runner for MS SQL Server
 */
async function executeMSSQLQuery(poolInstance, requestOrPool, sqlStr, params = []) {
  const sql = require('mssql');
  const request = requestOrPool instanceof sql.Request 
    ? requestOrPool 
    : (requestOrPool instanceof sql.Transaction 
        ? new sql.Request(requestOrPool) 
        : poolInstance.request());

  const { query, inputs } = translateQueryToMSSQL(sqlStr, params);

  for (const input of inputs) {
    if (input.value === null || input.value === undefined) {
      request.input(input.name, sql.NVarChar, null);
    } else if (typeof input.value === 'boolean') {
      request.input(input.name, sql.Bit, input.value ? 1 : 0);
    } else if (typeof input.value === 'number') {
      if (Number.isInteger(input.value)) {
        request.input(input.name, sql.Int, input.value);
      } else {
        request.input(input.name, sql.Decimal(12, 2), input.value);
      }
    } else if (input.value instanceof Date) {
      request.input(input.name, sql.DateTime, input.value);
    } else {
      request.input(input.name, sql.NVarChar, String(input.value));
    }
  }

  const result = await request.query(query);

  if (result.recordset) {
    return [result.recordset, null];
  } else {
    const affected = (result.rowsAffected && result.rowsAffected[0]) ? result.rowsAffected[0] : 0;
    return [{ affectedRows: affected, insertId: null }, null];
  }
}

// --------------------------------------------------------------------
// UNIFIED POOL WRAPPER
// --------------------------------------------------------------------
const unifiedPool = {
  async query(sqlStr, params = []) {
    if (DB_TYPE === 'mssql') {
      const poolInstance = await getMSSQLPool();
      if (!poolInstance) {
        // Fallback to MySQL if MS SQL Server is offline
        return mysqlPool.query(sqlStr, params);
      }
      return executeMSSQLQuery(poolInstance, poolInstance, sqlStr, params);
    } else {
      return mysqlPool.query(sqlStr, params);
    }
  },

  async getConnection() {
    if (DB_TYPE === 'mssql') {
      const poolInstance = await getMSSQLPool();
      if (!poolInstance) {
        return mysqlPool.getConnection();
      }

      const sql = require('mssql');
      const transaction = new sql.Transaction(poolInstance);

      return {
        async beginTransaction() {
          await transaction.begin();
        },
        async query(sqlStr, params = []) {
          const request = new sql.Request(transaction);
          return executeMSSQLQuery(poolInstance, request, sqlStr, params);
        },
        async commit() {
          await transaction.commit();
        },
        async rollback() {
          try {
            await transaction.rollback();
          } catch (e) {
            // Already rolled back or closed
          }
        },
        release() {
          // MS SQL Server transactions manage connection scope automatically
        }
      };
    } else {
      return mysqlPool.getConnection();
    }
  }
};

// Universal connection tester
const testConnection = async () => {
  if (DB_TYPE === 'mssql') {
    const p = await getMSSQLPool();
    if (p) {
      console.log('✅ MS SQL Server (SSMS) connection verified and ready!');
      return true;
    } else {
      console.warn('⚠️ MS SQL Server not currently reachable. Will attempt fallback to MySQL or memory cache.');
      return false;
    }
  } else {
    try {
      const connection = await mysqlPool.getConnection();
      console.log('✅ Connected successfully to MySQL Database: achinis_fashion_db');
      connection.release();
      return true;
    } catch (error) {
      console.warn('⚠️ Could not connect to MySQL Database:', error.message);
      return false;
    }
  }
};

module.exports = {
  pool: unifiedPool,
  getMSSQLPool,
  testConnection,
  DB_TYPE,
  mssqlConfig
};
