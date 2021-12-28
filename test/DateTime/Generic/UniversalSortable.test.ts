import { DateTime } from "../../../src"
import fs from "fs"
import assert from "assert"

describe("Date, universal sortable", () => {
    it("Writes in the expected format", function() {
        this.slow(20)
        const logFileData = new DateTime.Generic.UniversalSortable(10, undefined, true)
        logFileData.build()
        let content: string
        try {
            assert(
                logFileData.filename?.match(/[.]u[.]/),
                `Filename ${logFileData.filename} matches expected pattern`
            )
            content = fs.readFileSync(logFileData.filename!, {encoding: "utf-8"})
        } finally {
            logFileData.finish()
        }
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