import * as providers from "providers";
import { SeederCache } from "./SeederCache";

export interface ISeeder<Entity> {
    name: keyof providers.Repositories;
    dependencies: (keyof providers.Repositories)[];
    seed(db: providers.Repositories, cache: SeederCache): Promise<Entity[]>;
}
