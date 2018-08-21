import * as nest from "@nestjs/common";
import { CronJobRegistry } from "./CronJobRegistry";

export const CronJobProvider: nest.Provider = {
    provide: "CronJobRegistry",
    useValue: CronJobRegistry
};
