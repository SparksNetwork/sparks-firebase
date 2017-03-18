export const makeConsoleLogHandler = name =>
  async function consoleLogHandler(message) {
    console.log(message)
    return true
  }
