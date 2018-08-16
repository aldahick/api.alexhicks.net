import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";

async function main() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}

main().catch(console.error);
