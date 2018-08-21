import * as nest from "@nestjs/common";
import * as providers from "providers";

const FREQUENCY = process.env.NODE_ENV === "production" ? 5 : 1;

@nest.Injectable()
@nest.Controller()
export class SlackCalendarJob {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @providers.Scheduled(FREQUENCY * 60)
    async fetchMore() {
        console.log(`I'm running every ${FREQUENCY} minutes! And I have ${this.db ? "a database!" : "no database."}`);
    }
}
