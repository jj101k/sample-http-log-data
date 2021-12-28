import { DateTime } from "../../src"
import fs from "fs"
import assert from "assert"

describe("Date, universal sortable", () => {
    it("Writes in the expected format", function() {
        this.slow(20)
        const logFileData = new DateTime.UniversalSortable(10, undefined, true)
        logFileData.build()
        const content = fs.readFileSync(logFileData.filename!, {encoding: "utf-8"})
        logFileData.finish()
        const lines = content.split(/\r?\n/)
        assert(lines[lines.length - 1] == "", "Ends with newline")
        lines.pop()
        for(const line of lines) {
            assert(
                line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z .+$/),
                `Line ${line} is in expected format`
            )
        }
    })
})