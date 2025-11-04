export type DatabaseType = 'mysql' | 'postgresql' | 'oracle';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idle: number;
  };
  charset?: string;
  timezone?: string;
}

export interface MySQLConfig extends DatabaseConfig {
  type: 'mysql';
  charset?: string;
  timezone?: string;
}

export interface PostgreSQLConfig extends DatabaseConfig {
  type: 'postgresql';
  ssl?: boolean;
}

export interface OracleConfig extends DatabaseConfig {
  type: 'oracle';
  serviceName?: string;
  sid?: string;
}

export type DatabaseConnectionConfig = MySQLConfig | PostgreSQLConfig | OracleConfig;

// Default configurations for each database type
export const DEFAULT_CONFIGS: Record<DatabaseType, Partial<DatabaseConnectionConfig>> = {
  mysql: {
    port: 3306,
    charset: 'utf8mb4',
    timezone: 'UTC',
    pool: {
      min: 2,
      max: 10,
      idle: 10000,
    },
  },
  postgresql: {
    port: 5432,
    ssl: false,
    pool: {
      min: 2,
      max: 10,
      idle: 10000,
    },
  },
  oracle: {
    port: 1521,
    pool: {
      min: 2,
      max: 10,
      idle: 10000,
    },
  },
};

// Environment-based configuration
export const getDatabaseConfig = (): DatabaseConnectionConfig => {
  const dbType = (process.env.DB_TYPE as DatabaseType) || 'mysql';
  const baseConfig = DEFAULT_CONFIGS[dbType];

  switch (dbType) {
    case 'mysql':
      return {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_NAME || 'hushryd',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        charset: process.env.DB_CHARSET || 'utf8mb4',
        timezone: process.env.DB_TIMEZONE || 'UTC',
        pool: {
          min: parseInt(process.env.DB_POOL_MIN || '2'),
          max: parseInt(process.env.DB_POOL_MAX || '10'),
          idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
        },
        ...baseConfig,
      } as MySQLConfig;

    case 'postgresql':
      return {
        type: 'postgresql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'hushryd',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.DB_SSL === 'true',
        pool: {
          min: parseInt(process.env.DB_POOL_MIN || '2'),
          max: parseInt(process.env.DB_POOL_MAX || '10'),
          idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
        },
        ...baseConfig,
      } as PostgreSQLConfig;

    case 'oracle':
      return {
        type: 'oracle',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '1521'),
        database: process.env.DB_NAME || 'hushryd',
        username: process.env.DB_USER || 'system',
        password: process.env.DB_PASSWORD || '',
        serviceName: process.env.DB_SERVICE_NAME,
        sid: process.env.DB_SID,
        pool: {
          min: parseInt(process.env.DB_POOL_MIN || '2'),
          max: parseInt(process.env.DB_POOL_MAX || '10'),
          idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
        },
        ...baseConfig,
      } as OracleConfig;

    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
};
