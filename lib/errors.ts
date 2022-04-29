export class NoteParseError extends Error {
  public readonly wrappedError?: Error;

  constructor(message: string, public readonly notePath: string, err: Error) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoteParseError);
    }
    this.wrappedError = err;
    this.name = NoteParseError.name;
  }

  public toString(): string {
    return `${this.message};\n;path: ${this.notePath};\n${this.stack}`;
  }
}

export class BuildTimeError extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BuildTimeError);
    }
    this.name = BuildTimeError.name;
  }
}
