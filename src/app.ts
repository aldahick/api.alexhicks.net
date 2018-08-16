import * as nest from "@nestjs/common";
import * as controllers from "./controllers";
import * as providers from "./providers";

@nest.Module({
    imports: [],
    controllers: Object.values(controllers),
    providers: [
        providers.ConfigProvider,
        providers.DatabaseProvider,
        providers.BearerStrategy
    ],
})
export class AppModule { }
