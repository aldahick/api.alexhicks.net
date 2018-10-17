// tslint:disable no-console

import { register } from "tsconfig-paths";
register({
    baseUrl: __dirname,
    paths: {}
});
import { NestFactory } from "@nestjs/core";
import * as nest from "@nestjs/common";
import { AppModule } from "app";

let app: (nest.INestApplication & nest.INestExpressApplication);

async function main() {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.API_PORT || 3000);
}

// tslint:disable-next-line
if ((app!) === undefined) {
    main().catch(console.error);
}
