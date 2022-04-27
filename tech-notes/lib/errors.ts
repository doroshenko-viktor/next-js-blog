export class NoteParseError extends Error {
  public readonly wrappedError?: Error;

  constructor(
    message: string,
    public readonly noteName: string,
    public readonly notePath: string,
    err: Error
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoteParseError);
    }
    this.wrappedError = err;
    this.name = NoteParseError.name;
  }

  public toString(): string {
    return `${this.message};\nnote: ${this.noteName};path: ${this.notePath};\n${this.stack}`;
  }
}
