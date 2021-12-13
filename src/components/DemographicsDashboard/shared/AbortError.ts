export class AbortError extends Error {
  constructor() {
    super("aborted");
  }
}
