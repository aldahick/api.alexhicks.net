import { CronJob } from "./CronJob";

class Registry {
    jobs: CronJob[] = [];
    timer: NodeJS.Timer;

    constructor() {
        this.timer = setInterval(this.run, 30 * 1000);
    }

    add(job: CronJob): void {
        this.jobs.push(job);
    }

    run = async () => {
        await Promise.all(this.jobs
            .filter(j => j.shouldRun())
            .map(j => j.run())
        ).catch(console.error);
    };
}

export const CronJobRegistry = new Registry();
