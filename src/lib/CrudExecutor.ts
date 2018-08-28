import * as _ from "lodash";
import * as nest from "@nestjs/common";
import * as orm from "typeorm";
import * as db from "models";

export class CrudExecutor {
    static async create<Entity>(
        repo: orm.Repository<Entity>,
        entity: Partial<Entity>
    ): Promise<Entity> {
        const hasRequiredColumns = repo.metadata.ownColumns
            .filter(c => !c.isNullable && !c.isGenerated && !c.isCreateDate && !c.isUpdateDate)
            .every(c => entity[c.propertyName as keyof Entity] !== undefined);
        if (!hasRequiredColumns) throw new nest.UnprocessableEntityException();
        const indices = repo.metadata.ownIndices
            .filter(i => i.isUnique)
            .map(i => i.givenColumnNames as (keyof Entity)[]);
        const existingCount = await Promise.all(indices.map(index =>
            repo.count(_.mapValues(_.mapKeys(index, k => k), k => entity[k]))
        )).then(c => c.reduce((p, v) => p + v, 0));
        if (existingCount !== 0) throw new nest.ConflictException();
        return repo.save(entity as any).then(e => _.omit(e, "user")) as Promise<Entity>;
    }

    static async getOne<Entity>(
        repo: orm.Repository<Entity>,
        id: number,
        user?: db.User | false
    ): Promise<Entity> {
        const query = repo.createQueryBuilder("entity").whereInIds([id]);
        if (user !== undefined) {
            const relation = repo.metadata.ownRelations
                .find(r => r.inverseEntityMetadata.name === "User");
            if (relation === undefined) {
                throw new nest.InternalServerErrorException("No user relation on " + repo.metadata.name);
            }
            query.leftJoin("entity." + relation.propertyName, "user")
                .andWhere("user.id = :userId", {
                    userId: (user || { id: -1 }).id
                });
        }
        const item = await query.getOne();
        if (item === undefined) throw new nest.NotFoundException();
        return item;
    }
}
