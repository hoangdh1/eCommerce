import path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { ICradle } from './container';
import cors from 'cors';
import pg from 'pg';
import mariadb from 'mariadb';
import { Sequelize, Dialect } from 'sequelize';
import { models } from './models';
import compress from 'compression';
import helmet from 'helmet';
import moment from 'moment-timezone';
import * as i18n from 'i18n';
import Redis from 'ioredis';
import Queue from 'bull';

const initI18n = () => {
    i18n.configure({
        locales: ['VI', 'EN'],
        directory: path.join(__dirname, '..', 'locales'),
    });
};

const pathEnv = path.join(__dirname, '..', '.env');

export const initEnv = () => {
    dotenv.config({ path: pathEnv });
};

const initTimeZone = ({ env }: ICradle) => {
    const TIMEZONE = env.TIMEZONE;
    /**
     * * Init moment timezone
     */
    moment.tz.setDefault(TIMEZONE);
};

export const registerSequelizeModel = (iCradle: ICradle) => {
    const { env } = iCradle;
    const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
        host: env.DB_HOST,
        dialectModule: env.DB == 'postgres' ? pg : mariadb,
        dialect: env.DB as Dialect,
        dialectOptions: {
            useUTC: false, //* for reading from database
            dateStrings: true,
        },
        logging: false,
        port: env.DB_PORT,
        replication: {
            read: [
                {
                    host: env.DB_HOST,
                    username: env.DB_USER,
                    password: env.DB_PASSWORD,
                },
            ],
            write: {
                host: env.DB_HOST,
                username: env.DB_USER,
                password: env.DB_PASSWORD,
            },
        },
        pool: {
            max: 10,
            min: 1,
            idle: 20000,
            acquire: 50000,
            evict: 1000,
        },
        timezone: env.TIMEZONE,
        minifyAliases: true,
        /**
         * * Define hook for all model
         */
        define: {
            hooks: {
                afterFind() {},
            },
            underscored: true,
            freezeTableName: true,
        },
    });

    return {
        sequelize,
        models: models(sequelize, iCradle),
    };
};

export const setupRedis = (iCradle: ICradle) => {
    const { env } = iCradle;
    const redis = new Redis({
        host: env.REDIS_HOST, // Redis host
        port: env.REDIS_PORT, // Redis port
        // username: 'default', // needs Redis >= 6
        // password: 'my-top-secret',
        // db: 0, // Defaults to 0
    });

    const deleteAcountQueue = new Queue('deleteAcount', {
        redis: {
            host: env.REDIS_BULL_HOST || 'localhost',
            port: env.REDIS_BULL_PORT || 6380,
            // password: 'root',
        },
    });

    const saleOffQueue = new Queue('saleOff', {
        redis: {
            host: env.REDIS_BULL_HOST || 'localhost',
            port: env.REDIS_BULL_PORT || 6380,
        },
    });

    const endSaleQueue = new Queue('endSale', {
        redis: {
            host: env.REDIS_BULL_HOST || 'localhost',
            port: env.REDIS_BULL_PORT || 6380,
        },
    });

    return {
        redis,
        deleteAcountQueue,
        saleOffQueue,
        endSaleQueue,
    };
};

export const setup = async (iCradle: ICradle) => {
    initEnv();
    initI18n();
    initTimeZone(iCradle);

    await registerSequelizeModel(iCradle);
    console.debug(`🚀 Register sequelize model successfully 🚀`);
    console.debug(`🚀 Register sentry successfully 🚀`);
    await setupRedis(iCradle);
    console.debug(`🚀 Set up Redis successfully 🚀`);
};

export const startServer = async ({ env, routers, middlewares }: ICradle) => {
    const HOST = env.HOST || 'localhost';
    const PORT = env.PORT || 8002;
    const ENV = env.NODE_ENV;
    const app = express();

    const server = http.createServer(app);

    app.use(cors());
    app.enable('trust proxy');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(compress());
    app.use(helmet());

    app.use(
        env.PUBLIC_SAMPLE_PATH_FILE,
        express.static(path.join(__dirname, '..', 'public')),
    );

    // app.use(middlewares.authMiddleware.auth);
    app.use(
        middlewares.authMiddleware.auth.unless({
            path: [
                '/v1/cms/admins/register',
                '/v1/cms/admins/login',
                '/v1/cms/customers/register',
                '/v1/cms/customers/login',
                // '/v1/cms/shippers/register',
                '/v1/cms/shippers/login',
            ],
        }),
    );
    app.use('/', routers.routers);
    // if (env.NODE_ENV == 'local') {
    //     app.use(middlewares.authSwaggerMiddleware.isAuth, express.static(path.join(__dirname, '..', 'swagger')));
    // } else if (env.NODE_ENV != 'local' && env.SWAGGER_PATH) {
    //     app.use(middlewares.authSwaggerMiddleware.isAuth, express.static(env.SWAGGER_PATH));
    // }

    app.use(middlewares.catchErrorMiddleware.catchError);

    app.use(middlewares.rateLimitMiddleware.rateLimitPerSecond);

    server.listen(PORT, HOST, () => {
        console.log(
            `--- Server is running at http://${HOST}:${PORT} in ${ENV} mode`,
        );
        console.log('  Press CTRL-C to stop\n');
    });
};

export const consoleSetup = ({ helpers }: ICradle) => {
    const { appLogger } = helpers.loggerHelper;

    console.log = function () {
        return appLogger.info(arguments);
    };
    console.error = function () {
        return appLogger.error(arguments);
    };
    console.info = function () {
        return appLogger.warn(arguments);
    };
};
