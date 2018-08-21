import { CronJob, CronJobRegistry } from "..";

/**
 * Marks a controller method as being run every `frequency` seconds
 * @param  frequency interval to run method at (in seconds)
 */
export function Scheduled(frequency: number): MethodDecorator {
    return (target, methodName) => {
        CronJobRegistry.add(new CronJob(frequency, target.constructor.name, methodName.toString()));
    };
}
