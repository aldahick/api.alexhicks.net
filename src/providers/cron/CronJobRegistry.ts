import { CronJob } from "./CronJob";

class Registry {
    jobs: CronJob[] = [];
    timer: NodeJS.Timer;

    constructor() {
        this.timer = setInterval(this.run, 60 * 1000);
    }

    add(job: CronJob): void {
        this.jobs.push(job);
    }

    run = async () => {
        await Promise.all(this.jobs
            .filter(j => j.shouldRun())
            .map(j => j.run())
        );
    };
}

export const CronJobRegistry = new Registry();
