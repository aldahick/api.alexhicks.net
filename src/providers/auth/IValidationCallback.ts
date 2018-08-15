import { User } from "../../models";

export type IValidationCallback = (err: Error | undefined, user: User | false) => void;
