import * as awilix from 'awilix';
import { registerEnv } from './registerEnv';
import {
    setup,
    startServer,
    registerSequelizeModel,
    setupRedis,
} from './config';
import { controllers } from './controllers';
import { helpers } from './helpers';
import { repositories } from './repositories';
import { routers } from './routers';
import { useCases } from './usecases';
import { middlewares } from './middlewares';

export interface ICradle {
    env: ReturnType<typeof registerEnv>;
    setup: ReturnType<typeof setup>;
    startServer: ReturnType<typeof startServer>;
    sequelizeModel: ReturnType<typeof registerSequelizeModel>;
    helpers: ReturnType<typeof helpers>;
    controllers: ReturnType<typeof controllers>;
    repositories: ReturnType<typeof repositories>;
    routers: ReturnType<typeof routers>;
    useCases: ReturnType<typeof useCases>;
    middlewares: ReturnType<typeof middlewares>;
    setupRedis: ReturnType<typeof setupRedis>;
}

export const createContainer = () => {
    const container = awilix.createContainer();

    container.register({
        env: awilix.asFunction(registerEnv).singleton(),
        setup: awilix.asFunction(setup).singleton(),
        helpers: awilix.asFunction(helpers).singleton(),
        startServer: awilix.asFunction(startServer).singleton(),
        sequelizeModel: awilix.asFunction(registerSequelizeModel).singleton(),
        controllers: awilix.asFunction(controllers).singleton(),
        repositories: awilix.asFunction(repositories).singleton(),
        routers: awilix.asFunction(routers).singleton(),
        useCases: awilix.asFunction(useCases).singleton(),
        middlewares: awilix.asFunction(middlewares).singleton(),
        setupRedis: awilix.asFunction(setupRedis).singleton(),
    });

    return container;
};
