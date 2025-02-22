const chalk = require('chalk')
const log = console.log
const clog = {
    success: async function (...attr) {
        log(chalk.black.bgGreenBright(' success '), ...attr)
    },
    warn: async function (...attr) {
        log(chalk.black.bgYellowBright(' warning '), ...attr)
    },
    error: async function (...attr) {
        log(chalk.whiteBright.bgRedBright.bold(' error '), ...attr)
    },
    info: async function (...attr) {
        log(chalk.blue.bgWhiteBright(' info '), ...attr)
    },
    sql: async function (...attr) {
        log(chalk.white.bgMagenta(' SQL '), ...attr)
    },
}


module.exports = clog;


