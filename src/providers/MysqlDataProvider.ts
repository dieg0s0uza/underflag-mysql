import { IDataProvider, Feature } from 'underflag';
import { Connection, Pool } from 'mysql2';

const DEFAULT_TABLE = 'features';

interface Options {
    /** Table name of data. Default: 'features' */
    tableName?: string,
    /** An instance of mysql connection */
    connection: Connection | Pool
}

export class MysqlDataProvider implements IDataProvider {
    private connection: Connection | Pool;
    private tableName: string;

    constructor(options: Options) {
        this.connection = options.connection;
        this.tableName = options.tableName || DEFAULT_TABLE;
    }

    async getAll(): Promise<Feature[]> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ??', [this.tableName], (err, results: any[]) => {
                if (err) return reject(err);
                resolve(results as Feature[]);
            });
        });
    }

    async get(key: string): Promise<Feature | undefined> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ?? WHERE `key` = ?', [this.tableName, key], (err, results: any[]) => {
                if (err) return reject(err);
                resolve(results.length ? results[0] as Feature : undefined);
            });
        });
    }
}