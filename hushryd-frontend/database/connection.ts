import { DatabaseConnectionConfig, getDatabaseConfig } from './config';

export interface DatabaseConnection {
  query: (sql: string, params?: any[]) => Promise<any>;
  transaction: <T>(callback: (trx: DatabaseConnection) => Promise<T>) => Promise<T>;
  close: () => Promise<void>;
  isConnected: () => boolean;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  fields?: any[];
}

export interface Transaction {
  query: (sql: string, params?: any[]) => Promise<any>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

class DatabaseManager {
  private connections: Map<string, DatabaseConnection> = new Map();
  private config: DatabaseConnectionConfig;

  constructor(config?: DatabaseConnectionConfig) {
    this.config = config || getDatabaseConfig();
  }

  async connect(connectionName: string = 'default'): Promise<DatabaseConnection> {
    if (this.connections.has(connectionName)) {
      return this.connections.get(connectionName)!;
    }

    const connection = await this.createConnection(this.config);
    this.connections.set(connectionName, connection);
    return connection;
  }

  private async createConnection(config: DatabaseConnectionConfig): Promise<DatabaseConnection> {
    switch (config.type) {
      case 'mysql':
        return await this.createMySQLConnection(config);
      case 'postgresql':
        return await this.createPostgreSQLConnection(config);
      case 'oracle':
        return await this.createOracleConnection(config);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  private async createMySQLConnection(config: any): Promise<DatabaseConnection> {
    const mysql = require('mysql2/promise');
    
    const pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      charset: config.charset,
      timezone: config.timezone,
      connectionLimit: config.pool.max,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
    });

    return {
      query: async (sql: string, params?: any[]) => {
        const [rows] = await pool.execute(sql, params);
        return { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
      },
      transaction: async <T>(callback: (trx: DatabaseConnection) => Promise<T>) => {
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          const result = await callback({
            query: async (sql: string, params?: any[]) => {
              const [rows] = await connection.execute(sql, params);
              return { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
            },
            transaction: async () => { throw new Error('Nested transactions not supported'); },
            close: async () => {},
            isConnected: () => true,
          });
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      },
      close: async () => {
        await pool.end();
      },
      isConnected: () => pool.pool._allConnections.length > 0,
    };
  }

  private async createPostgreSQLConnection(config: any): Promise<DatabaseConnection> {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
      max: config.pool.max,
      min: config.pool.min,
      idleTimeoutMillis: config.pool.idle,
      connectionTimeoutMillis: 60000,
    });

    return {
      query: async (sql: string, params?: any[]) => {
        const result = await pool.query(sql, params);
        return { 
          rows: result.rows, 
          rowCount: result.rowCount,
          fields: result.fields 
        };
      },
      transaction: async <T>(callback: (trx: DatabaseConnection) => Promise<T>) => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const result = await callback({
            query: async (sql: string, params?: any[]) => {
              const result = await client.query(sql, params);
              return { 
                rows: result.rows, 
                rowCount: result.rowCount,
                fields: result.fields 
              };
            },
            transaction: async () => { throw new Error('Nested transactions not supported'); },
            close: async () => {},
            isConnected: () => true,
          });
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      },
      close: async () => {
        await pool.end();
      },
      isConnected: () => pool.totalCount > 0,
    };
  }

  private async createOracleConnection(config: any): Promise<DatabaseConnection> {
    const oracledb = require('oracledb');
    
    // Configure Oracle connection
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.autoCommit = false;

    const pool = await oracledb.createPool({
      user: config.username,
      password: config.password,
      connectString: `${config.host}:${config.port}/${config.serviceName || config.sid || config.database}`,
      poolMin: config.pool.min,
      poolMax: config.pool.max,
      poolIncrement: 1,
      poolTimeout: 60,
      stmtCacheSize: 30,
    });

    return {
      query: async (sql: string, params?: any[]) => {
        const connection = await pool.getConnection();
        try {
          const result = await connection.execute(sql, params || []);
          return { 
            rows: result.rows || [], 
            rowCount: result.rowsAffected || 0,
            fields: result.metaData 
          };
        } finally {
          await connection.close();
        }
      },
      transaction: async <T>(callback: (trx: DatabaseConnection) => Promise<T>) => {
        const connection = await pool.getConnection();
        try {
          const result = await callback({
            query: async (sql: string, params?: any[]) => {
              const result = await connection.execute(sql, params || []);
              return { 
                rows: result.rows || [], 
                rowCount: result.rowsAffected || 0,
                fields: result.metaData 
              };
            },
            transaction: async () => { throw new Error('Nested transactions not supported'); },
            close: async () => {},
            isConnected: () => true,
          });
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          await connection.close();
        }
      },
      close: async () => {
        await pool.close();
      },
      isConnected: () => pool.connectionsOpen > 0,
    };
  }

  async disconnect(connectionName: string = 'default'): Promise<void> {
    const connection = this.connections.get(connectionName);
    if (connection) {
      await connection.close();
      this.connections.delete(connectionName);
    }
  }

  async disconnectAll(): Promise<void> {
    const promises = Array.from(this.connections.values()).map(conn => conn.close());
    await Promise.all(promises);
    this.connections.clear();
  }

  getConnection(connectionName: string = 'default'): DatabaseConnection | undefined {
    return this.connections.get(connectionName);
  }

  isConnected(connectionName: string = 'default'): boolean {
    const connection = this.connections.get(connectionName);
    return connection ? connection.isConnected() : false;
  }
}

// Singleton instance
export const dbManager = new DatabaseManager();

// Convenience functions
export const connect = (connectionName?: string) => dbManager.connect(connectionName);
export const disconnect = (connectionName?: string) => dbManager.disconnect(connectionName);
export const disconnectAll = () => dbManager.disconnectAll();
export const getConnection = (connectionName?: string) => dbManager.getConnection(connectionName);
export const isConnected = (connectionName?: string) => dbManager.isConnected(connectionName);
