import * as nest from "@nestjs/common";
import * as express from "express";

export const User = nest.createParamDecorator(
    (_, req: express.Request) => req.user
);
