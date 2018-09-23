class ServerLogger {
  static debug(message) {
    Cable.send('log_debug', { message: message });
  }
}
