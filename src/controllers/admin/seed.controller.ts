import * as nest from "@nestjs/common";
import * as db from "models";
import * as providers from "providers";
import { ISeeder, SeederCache } from "lib/seed";
import * as SeedTargets from "lib/seed/targets";
import toposort = require("toposort");

@nest.UseGuards(
    providers.AuthGuard(),
    providers.PermissionGuard(db.UserRole.Admin)
)
@nest.Injectable()
@nest.Controller("seed")
export class AdminSeedController {
    private readonly logger = new nest.Logger("admin/seed");
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Post()
    async all() {
        const targets: ISeeder<any>[] = Object.values(SeedTargets).map(T => new T());
        const missingDependencies = targets.map(t =>
            t.dependencies.filter(d => !targets.some(t => t.name === d))
        ).reduce((p, v) => p.concat(v), []);
        if (missingDependencies.length > 0) {
            this.logger.error("Can't find seeders for dependencies: " + missingDependencies.join(","));
            throw new nest.InternalServerErrorException();
        }
        const targetNames = toposort(targets.map(t =>
            t.dependencies.map(d => [t.name, d] as [string, string])
        ).reduce((p, v) => p.concat(v), [])).slice().reverse() as ReadonlyArray<keyof providers.Repositories>;
        this.logger.log(targetNames.join(", "));
        const cache: SeederCache = {};
        for (const targetName of targetNames) {
            this.logger.log(`Seeding ${targetName}...`);
            const target = targets.find(t => t.name === targetName)!;
            const results = await target.seed(this.db, cache);
            this.logger.log(`\tGenerated ${target.name}...`);
            await this.db[target.name].save(results);
            (cache as any)[target.name] = results;
            this.logger.log(`\tSeeded ${results.length} ${target.name}`);
        }
        const total = Object.values(cache).reduce((p, v) => p + v!.length, 0);
        this.logger.log(`Seeded ${total} rows.`);
        return { total };
    }
}
