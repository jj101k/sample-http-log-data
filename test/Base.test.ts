import { DateTime } from "../src"
import fs from "fs"
import assert from "assert"
import path from "path"

describe("Base functionality", () => {
    describe("Writes with supplied dir", function() {
        let dir: string
        beforeEach(() => {
            dir = "/tmp/" + Math.random()
            fs.mkdirSync(dir)
        })
        afterEach(() => {
            if(fs.existsSync(dir)) {
                fs.rmdirSync(dir)
            }
        })
        this.slow(100)
        it("can write a file with supplied path (basic, no cleanup)", () => {
            const logFileData = new DateTime.Syslog(100, dir, true)
            try {
                assert(
                    path.dirname(logFileData.filename!) == dir,
                    "File is in the right location"
                )
                logFileData.build()
                assert(logFileData.filename, "filename is set")
                assert(
                    fs.existsSync(logFileData.filename!),
                    "File is created"
                )
            } finally {
                if(logFileData.filename) {
                    fs.rmSync(logFileData.filename)
                }
            }
        })
        it("can write a file with supplied path (with cleanup)", () => {
            const logFileData = new DateTime.Syslog(100, dir, true)
            logFileData.build()
            logFileData.finish()
            assert(!fs.existsSync(logFileData.filename!), "File is removed in cleanup")
            assert(fs.existsSync(dir), "Supplied dir still exists")
        })
    })
    describe("Writes without supplied dir", function() {
        this.slow(100)
        it("can write a file without supplied path", () => {
            const logFileData = new DateTime.Syslog(100, undefined, true)
            logFileData.build()
            assert(logFileData.filename, "filename is set")
            assert(
                fs.existsSync(logFileData.filename!),
                "File is created"
            )
            const dir = path.dirname(logFileData.filename!)
            logFileData.finish()
            assert(!fs.existsSync(logFileData.filename!), "File is removed in cleanup")
            assert(!fs.existsSync(dir), "Directory is removed in cleanup")
        })
    })
})