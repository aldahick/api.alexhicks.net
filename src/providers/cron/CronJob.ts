import { app } from "main";

export class CronJob {
    lastRunTime = 0;

    constructor(
        public readonly frequency: number,
        private readonly controllerName: string,
        private readonly methodName: string
    ) {
        if (process.env.NODE_ENV !== "production") {
            setTimeout(this.run, 1000);
        }
    }

    shouldRun() {
        return Date.now() - this.lastRunTime > this.frequency * 1000;
    }

    run = () => {
        this.lastRunTime = Date.now();
        return app.get<any>(this.controllerName)[this.methodName]();
    };
}
