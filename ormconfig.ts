// todo refactor it
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path: process.env.production ? '.env' : '.env.development.local',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrationsRun: true,
  migrationsTableName: 'migrations_typeorm',
  synchronize:
    process.env.NODE_ENV === 'development' && !process.env.DISABLE_SYNC,
  dropSchema: false,
  migrations: ['./src/migrations/*.{ts,js}'],
});
