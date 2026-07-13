export interface RedactedOutputSink {
  appendRedacted(chunk: string): void;
}

export interface StreamRedactorProps {
  readonly secrets: readonly string[];
  readonly sink: RedactedOutputSink;
}

export interface StreamRedactor {
  write(chunk: string): void;
  end(): void;
  discard(): void;
}

export function createStreamRedactor(props: StreamRedactorProps): StreamRedactor {
  const secrets = [...new Set(props.secrets.filter((secret) => secret.length > 0))]
    .sort((left, right) => right.length - left.length);
  let pending = "";
  let finished = false;

  const emit = (value: string): void => {
    if (value.length > 0) {
      props.sink.appendRedacted(value);
    }
  };

  const longestSecretAtStart = (): string | undefined => secrets.find((secret) => pending.startsWith(secret));

  const firstSecretCandidateIndex = (): number | undefined => {
    for (let index = 0; index < pending.length; index += 1) {
      const candidate = pending.slice(index);
      if (secrets.some((secret) => candidate.startsWith(secret) || secret.startsWith(candidate))) {
        return index;
      }
    }
    return undefined;
  };

  const flushSafePrefix = (): void => {
    while (pending.length > 0) {
      const matchedSecret = longestSecretAtStart();
      if (matchedSecret !== undefined) {
        emit("[REDACTED]");
        pending = pending.slice(matchedSecret.length);
        continue;
      }
      const candidateIndex = firstSecretCandidateIndex();
      if (candidateIndex === undefined) {
        emit(pending);
        pending = "";
        return;
      }
      if (candidateIndex === 0) {
        return;
      }
      emit(pending.slice(0, candidateIndex));
      pending = pending.slice(candidateIndex);
    }
  };

  return {
    write(chunk: string): void {
      if (finished) {
        throw new Error("cannot write to a finished stream redactor");
      }
      pending += chunk;
      flushSafePrefix();
    },
    end(): void {
      if (finished) {
        return;
      }
      finished = true;
      flushSafePrefix();
      emit(pending);
      pending = "";
    },
    discard(): void {
      finished = true;
      pending = "";
    },
  };
}
