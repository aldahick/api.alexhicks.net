import * as orm from "typeorm";
import * as providers from "providers";

type ExtractRepositoryType<Repo> = Repo extends orm.Repository<infer M> ? M : never;
export type SeederCache = {
    [key in keyof providers.Repositories]?:
    ExtractRepositoryType<providers.Repositories[key]>[]
};
