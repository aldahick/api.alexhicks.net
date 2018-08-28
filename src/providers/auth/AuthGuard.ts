import * as nestAuth from "@nestjs/passport";

export const AuthGuard = () => nestAuth.AuthGuard("bearer");
