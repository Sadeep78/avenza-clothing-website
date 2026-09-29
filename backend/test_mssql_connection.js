/**
 * ====================================================================
 * AVENZA CLOTHES STORE - MS SQL SERVER CONNECTION TEST SCRIPT
 * File: backend/test_mssql_connection.js
 * Usage: node test_mssql_connection.js
 * ====================================================================
 */

require('dotenv').config();
const sql = require('mssql');
const { mssqlConfig } = require('./db');

console.log('====================================================================');
console.log(' TESTING CONNECTION TO MICROSOFT SQL SERVER (SSMS)');
console.log('====================================================================');
console.log(`Server:   ${mssqlConfig.server}:${mssqlConfig.port}`);
console.log(`Database: ${mssqlConfig.database}`);
console.log(`User:     ${mssqlConfig.user}`);
console.log('--------------------------------------------------------------------');

(async () => {
  try {
    const pool = await sql.connect(mssqlConfig);
    console.log('✅ CONNECTED TO MS SQL SERVER SUCCESSFULLY!\n');

    // 1. Check Server Version
    const verRes = await pool.request().query('SELECT @@VERSION AS [version], DB_NAME() AS [current_db]');
    console.log(`📌 SQL Server Instance: ${verRes.recordset[0].current_db}`);
    console.log(`📌 Version: ${verRes.recordset[0].version.split('\n')[0]}\n`);

    // 2. Check Database Tables
    const tablesRes = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_NAME
    `);

    if (tablesRes.recordset.length === 0) {
      console.warn('⚠️ No tables found in database ' + mssqlConfig.database);
      console.log('💡 Run backend/mssql_schema.sql in SSMS to create the tables.');
    } else {
      console.log(`✅ Found ${tablesRes.recordset.length} tables in ${mssqlConfig.database}:`);
      tablesRes.recordset.forEach(t => console.log(`   - ${t.TABLE_NAME}`));

      // 3. Count Products
      const prodRes = await pool.request().query('SELECT COUNT(*) AS total FROM products');
      console.log(`\n👕 Total Products in MS SQL: ${prodRes.recordset[0].total}`);

      // 4. Count Users
      const userRes = await pool.request().query('SELECT COUNT(*) AS total FROM users');
      console.log(`👤 Total Users in MS SQL:    ${userRes.recordset[0].total}`);
    }

    await pool.close();
    console.log('\n====================================================================');
    console.log(' ALL CHECKS PASSED! MS SQL SERVER IS READY FOR FRONTEND & BACKEND.');
    console.log('====================================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ MS SQL SERVER CONNECTION FAILED:');
    console.error(`   ${err.message}\n`);

    if (err.code === 'ESOCKET') {
      console.log('💡 DIAGNOSIS: TCP/IP (Port 1433) is not active yet.');
      console.log('   Steps to fix:');
      console.log('   1. Right-click backend/enable_mssql_tcp.bat -> Click "Run as administrator"');
      console.log('   OR');
      console.log('   2. In SQL Server Configuration Manager -> Enable TCP/IP -> Restart SQL Server');
    } else if (err.code === 'ELOGIN') {
      console.log('💡 DIAGNOSIS: Login failed for user ' + mssqlConfig.user);
      console.log('   Steps to fix:');
      console.log('   1. In SSMS, enable "SQL Server and Windows Authentication mode"');
      console.log('   2. Set password for "sa" or update backend/.env with your SQL credentials');
    }

    console.log('====================================================================');
    process.exit(1);
  }
})();
