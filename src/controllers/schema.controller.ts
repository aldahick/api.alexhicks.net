import * as fs from "fs-extra";
import * as nest from "@nestjs/common";
import * as recursiveReaddir from "recursive-readdir";
import * as providers from "providers";

@nest.Injectable()
@nest.Controller("schema")
export class SchemaController {
    constructor(
        readonly db: providers.Repositories
    ) { }

    @nest.Get("browser")
    async browser(): Promise<string> {
        const modelFiles = await recursiveReaddir(__dirname + "/../../src/models")
            .then(files => files.filter(f => f.endsWith(".ts") && !f.endsWith("index.ts")).sort());
        const models = await Promise.all(modelFiles.map(f => fs.readFile(f, "utf-8")));
        return models.map(m => m.split("\n")).map(lines => {
            lines = lines.filter(l =>
                !l.trim().startsWith("@") &&
                !l.startsWith("import ") &&
                l.trim().length > 0
            );
            const serverIndex = lines.map(l => l.trim()).indexOf("// schema:server-only");
            if (serverIndex === -1) return lines;
            return lines.slice(0, serverIndex).concat(["}"]);
        }).map(l => l.join("\n")).join("\n") + "\n";
    }
}
