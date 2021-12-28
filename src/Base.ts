import * as fs from "fs"
import * as path from "path"
import * as os from "os"

/**
 * Behaviour options
 */
export interface Options {
    /**
     * Log activity
     */
    log?: boolean,
}

export abstract class Base {
    protected abstract readonly logType: string
    protected readonly writeBlockLines = 10_000

    protected builtTemporaryDirectory?: string

    protected get temporaryDirectory() {
        return this.suppliedTemporaryDirectory ?? this.builtTemporaryDirectory
    }

    protected getContent(offset: number) {
        if(this.randomLineLengths) {
            return "#".repeat(1 + Math.floor(Math.random() * 256))
        } else {
            return "#".repeat(1 + offset % 256)
        }
    }

    protected initTemporaryDirectory() {
        if(this.temporaryDirectory === undefined) {
            const osTempPath = os.tmpdir()
            this.builtTemporaryDirectory = fs.mkdtempSync(`${osTempPath}${path.sep}`)
        }
    }

    /**
     * Log a message, if that is turned on.
     *
     * @param message
     */
    protected log(message: string) {
        if(this.options.log) {
            console.log(message)
        }
    }

    /**
     *
     * @param lines The number of lines to create
     * @param suppliedTemporaryDirectory
     * @param randomLineLengths
     * @param options
     */
    constructor(
        public lines: number,
        protected suppliedTemporaryDirectory?: string,
        private randomLineLengths: boolean = false,
        protected options: Options = {}
    ) {
    }

    /**
     * The full path to the file. Only available after/during build()
     */
    get filename() {
        if(this.temporaryDirectory) {
            return `${this.temporaryDirectory}/range1-${this.lines}.${this.logType}.example`
        } else {
            return undefined
        }
    }

    /**
     * Create the file
     */
    abstract build(): void

    /**
     * Clean up the file
     */
    finish() {
        if(this.filename) {
            fs.rmSync(this.filename)
        }
        if(this.builtTemporaryDirectory) {
            fs.rmdirSync(this.builtTemporaryDirectory)
        }
    }
}