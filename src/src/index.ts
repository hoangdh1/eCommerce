import { createContainer } from './container';

const main = async () => {
    const container = createContainer();
    await container.cradle.setup;
    await container.cradle.startServer;
    // await container.cradle.consoleSetup;
};

main();
