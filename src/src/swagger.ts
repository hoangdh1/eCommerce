import swaggerDocs from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { initEnv } from './config';
initEnv();

const env = process.env.NODE_ENV || 'debug';
let host = 'localhost:8099';
if (env == 'production') {
    host = 'api-hrm.acheckin.vn';
} else {
    host = 'localhost:8099';
}

const options = {
    definition: {
        swagger: '2.0',
        info: {
            title: 'ACheckin HRM Docs API',
            version: '1.0.0',
        },
        host,
        basePath: '',
        securityDefinitions: {
            Authorization: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
            'X-Workspace-Host': {
                type: 'apiKey',
                name: 'x-workspace-host',
                in: 'header',
            },
        },
        security: [
            {
                Authorization: [],
                'X-Workspace-Host': [],
            },
        ],
        schemes: ['https'],
        tags: [],
    },
    apis: [
        path.join(__dirname, 'routers', '**', '*.js'),
        path.join(__dirname, 'routers', '*.js'),
        path.join(__dirname, 'routers', '**', '*.router.js'),
    ],
};

const generateJson = swaggerDocs(options);

fs.writeFileSync(
    path.join(__dirname, '..', 'swagger', 'swagger.json'),
    JSON.stringify(generateJson),
    'utf8',
);

console.log('------ generate document success');
