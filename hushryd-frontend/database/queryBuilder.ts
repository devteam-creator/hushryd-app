import { DatabaseConnection } from './connection';

export interface QueryBuilder {
  select(columns: string | string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(condition: string, ...params: any[]): QueryBuilder;
  whereIn(column: string, values: any[]): QueryBuilder;
  whereBetween(column: string, start: any, end: any): QueryBuilder;
  join(table: string, condition: string): QueryBuilder;
  leftJoin(table: string, condition: string): QueryBuilder;
  rightJoin(table: string, condition: string): QueryBuilder;
  innerJoin(table: string, condition: string): QueryBuilder;
  orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder;
  groupBy(columns: string | string[]): QueryBuilder;
  having(condition: string, ...params: any[]): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  build(): { sql: string; params: any[] };
  execute(connection: DatabaseConnection): Promise<any>;
}

export class SQLQueryBuilder implements QueryBuilder {
  private query: {
    select: string[];
    from: string;
    joins: Array<{ type: string; table: string; condition: string }>;
    where: Array<{ condition: string; params: any[] }>;
    groupBy: string[];
    having: Array<{ condition: string; params: any[] }>;
    orderBy: Array<{ column: string; direction: string }>;
    limit?: number;
    offset?: number;
  } = {
    select: [],
    from: '',
    joins: [],
    where: [],
    groupBy: [],
    having: [],
    orderBy: [],
  };

  select(columns: string | string[]): QueryBuilder {
    this.query.select = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  from(table: string): QueryBuilder {
    this.query.from = table;
    return this;
  }

  where(condition: string, ...params: any[]): QueryBuilder {
    this.query.where.push({ condition, params });
    return this;
  }

  whereIn(column: string, values: any[]): QueryBuilder {
    const placeholders = values.map(() => '?').join(', ');
    this.query.where.push({ 
      condition: `${column} IN (${placeholders})`, 
      params: values 
    });
    return this;
  }

  whereBetween(column: string, start: any, end: any): QueryBuilder {
    this.query.where.push({ 
      condition: `${column} BETWEEN ? AND ?`, 
      params: [start, end] 
    });
    return this;
  }

  join(table: string, condition: string): QueryBuilder {
    this.query.joins.push({ type: 'INNER JOIN', table, condition });
    return this;
  }

  leftJoin(table: string, condition: string): QueryBuilder {
    this.query.joins.push({ type: 'LEFT JOIN', table, condition });
    return this;
  }

  rightJoin(table: string, condition: string): QueryBuilder {
    this.query.joins.push({ type: 'RIGHT JOIN', table, condition });
    return this;
  }

  innerJoin(table: string, condition: string): QueryBuilder {
    this.query.joins.push({ type: 'INNER JOIN', table, condition });
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): QueryBuilder {
    this.query.orderBy.push({ column, direction });
    return this;
  }

  groupBy(columns: string | string[]): QueryBuilder {
    this.query.groupBy = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  having(condition: string, ...params: any[]): QueryBuilder {
    this.query.having.push({ condition, params });
    return this;
  }

  limit(count: number): QueryBuilder {
    this.query.limit = count;
    return this;
  }

  offset(count: number): QueryBuilder {
    this.query.offset = count;
    return this;
  }

  build(): { sql: string; params: any[] } {
    const params: any[] = [];
    let sql = '';

    // SELECT clause
    if (this.query.select.length > 0) {
      sql += `SELECT ${this.query.select.join(', ')}`;
    } else {
      sql += 'SELECT *';
    }

    // FROM clause
    if (this.query.from) {
      sql += ` FROM ${this.query.from}`;
    }

    // JOIN clauses
    for (const join of this.query.joins) {
      sql += ` ${join.type} ${join.table} ON ${join.condition}`;
    }

    // WHERE clause
    if (this.query.where.length > 0) {
      const whereConditions = this.query.where.map(w => w.condition);
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
      for (const where of this.query.where) {
        params.push(...where.params);
      }
    }

    // GROUP BY clause
    if (this.query.groupBy.length > 0) {
      sql += ` GROUP BY ${this.query.groupBy.join(', ')}`;
    }

    // HAVING clause
    if (this.query.having.length > 0) {
      const havingConditions = this.query.having.map(h => h.condition);
      sql += ` HAVING ${havingConditions.join(' AND ')}`;
      for (const having of this.query.having) {
        params.push(...having.params);
      }
    }

    // ORDER BY clause
    if (this.query.orderBy.length > 0) {
      const orderByClause = this.query.orderBy.map(o => `${o.column} ${o.direction}`).join(', ');
      sql += ` ORDER BY ${orderByClause}`;
    }

    // LIMIT clause
    if (this.query.limit !== undefined) {
      sql += ` LIMIT ${this.query.limit}`;
    }

    // OFFSET clause
    if (this.query.offset !== undefined) {
      sql += ` OFFSET ${this.query.offset}`;
    }

    return { sql, params };
  }

  async execute(connection: DatabaseConnection): Promise<any> {
    const { sql, params } = this.build();
    return await connection.query(sql, params);
  }
}

// Insert query builder
export class InsertQueryBuilder {
  private table: string = '';
  private columns: string[] = [];
  private values: any[][] = [];

  into(table: string): InsertQueryBuilder {
    this.table = table;
    return this;
  }

  columns(cols: string[]): InsertQueryBuilder {
    this.columns = cols;
    return this;
  }

  values(vals: any[]): InsertQueryBuilder {
    this.values.push(vals);
    return this;
  }

  build(): { sql: string; params: any[] } {
    if (!this.table || this.columns.length === 0 || this.values.length === 0) {
      throw new Error('Table, columns, and values are required for INSERT query');
    }

    const placeholders = this.columns.map(() => '?').join(', ');
    const valuesPlaceholders = this.values.map(() => `(${placeholders})`).join(', ');
    
    const sql = `INSERT INTO ${this.table} (${this.columns.join(', ')}) VALUES ${valuesPlaceholders}`;
    const params = this.values.flat();

    return { sql, params };
  }

  async execute(connection: DatabaseConnection): Promise<any> {
    const { sql, params } = this.build();
    return await connection.query(sql, params);
  }
}

// Update query builder
export class UpdateQueryBuilder {
  private table: string = '';
  private sets: Array<{ column: string; value: any }> = [];
  private where: Array<{ condition: string; params: any[] }> = [];

  table(tableName: string): UpdateQueryBuilder {
    this.table = tableName;
    return this;
  }

  set(column: string, value: any): UpdateQueryBuilder {
    this.sets.push({ column, value });
    return this;
  }

  where(condition: string, ...params: any[]): UpdateQueryBuilder {
    this.where.push({ condition, params });
    return this;
  }

  build(): { sql: string; params: any[] } {
    if (!this.table || this.sets.length === 0) {
      throw new Error('Table and SET clauses are required for UPDATE query');
    }

    const setClause = this.sets.map(s => `${s.column} = ?`).join(', ');
    let sql = `UPDATE ${this.table} SET ${setClause}`;
    
    const params: any[] = this.sets.map(s => s.value);

    if (this.where.length > 0) {
      const whereConditions = this.where.map(w => w.condition);
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
      for (const where of this.where) {
        params.push(...where.params);
      }
    }

    return { sql, params };
  }

  async execute(connection: DatabaseConnection): Promise<any> {
    const { sql, params } = this.build();
    return await connection.query(sql, params);
  }
}

// Delete query builder
export class DeleteQueryBuilder {
  private table: string = '';
  private where: Array<{ condition: string; params: any[] }> = [];

  from(table: string): DeleteQueryBuilder {
    this.table = table;
    return this;
  }

  where(condition: string, ...params: any[]): DeleteQueryBuilder {
    this.where.push({ condition, params });
    return this;
  }

  build(): { sql: string; params: any[] } {
    if (!this.table) {
      throw new Error('Table is required for DELETE query');
    }

    let sql = `DELETE FROM ${this.table}`;
    const params: any[] = [];

    if (this.where.length > 0) {
      const whereConditions = this.where.map(w => w.condition);
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
      for (const where of this.where) {
        params.push(...where.params);
      }
    }

    return { sql, params };
  }

  async execute(connection: DatabaseConnection): Promise<any> {
    const { sql, params } = this.build();
    return await connection.query(sql, params);
  }
}

// Convenience functions
export const select = (columns?: string | string[]) => {
  const builder = new SQLQueryBuilder();
  if (columns) {
    builder.select(columns);
  }
  return builder;
};

export const insert = () => new InsertQueryBuilder();
export const update = () => new UpdateQueryBuilder();
export const del = () => new DeleteQueryBuilder();
