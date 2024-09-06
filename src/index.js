import { setupServer } from "./server.js";
import { initMongoConnect } from "./db/initMongoConnection.js";

const bootstrap = async () => {
    await initMongoConnect();
    setupServer();
};

bootstrap();