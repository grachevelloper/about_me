import * as dotenv from "dotenv";
import {DataSourceOptions} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

dotenv.config();

const {NODE_ENV} = process.env;

const dataSource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity.ts"],
    migrations: ["dist/migrations/**/*.js"],
    synchronize: NODE_ENV === "development",
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
};

export default dataSource;
