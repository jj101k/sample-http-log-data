import { DateTime } from "../../src"
import fs from "fs"
import assert from "assert"

describe("Syslog", () => {
    it("Writes in the expected format", function() {
        this.slow(20)
        const logFileData = new DateTime.Syslog(10, undefined, true)
        logFileData.build()
        let content: string
        try {
            assert(
                logFileData.filename?.match(/[.]syslog[.]/),
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
                line.match(/^\w{3} (?:[1-3][0-9]| [1-9]) \d\d:\d\d:\d\d [\w.-]+ \w+\[\d+\] .+$/),
                `Line ${line} is in expected format`
            )
        }
    })
})