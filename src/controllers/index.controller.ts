import * as nest from "@nestjs/common";

@nest.Controller()
export class IndexController {
    @nest.Get()
    async index() {
        return { statusCode: 200 };
    }
}
