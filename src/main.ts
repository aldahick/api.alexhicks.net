import { NestFactory } from "@nestjs/core";
import * as nest from "@nestjs/common";
import { AppModule } from "app";

export let app: nest.INestApplication & nest.INestExpressApplication;

async function main() {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.API_PORT || 3000);
}

if ((app!) === undefined) {
    main().catch(console.error);
}
