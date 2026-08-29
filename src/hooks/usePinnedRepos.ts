import { useEffect, useMemo, useRef, useState } from "react";
import type { PinnedRepo } from "../types/pinned";

type State =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: PinnedRepo[]; error: null }
  | { status: "error"; data: null; error: string };

export type PinnedReposView = {
  loading: boolean;
  available: boolean;
  data: PinnedRepo[];
  error: string | null;
};

function isPinnedRepo(value: unknown): value is PinnedRepo {
  if (typeof value !== "object" || value === null) return false;

  const repository = value as Record<string, unknown>;

  return (
    typeof repository.id === "string" &&
    typeof repository.name === "string" &&
    typeof repository.fullName === "string" &&
    typeof repository.description === "string" &&
    typeof repository.url === "string" &&
    typeof repository.stars === "number" &&
    typeof repository.forks === "number" &&
    typeof repository.updatedAt === "string" &&
    typeof repository.archived === "boolean" &&
    (repository.homepageUrl === undefined || typeof repository.homepageUrl === "string") &&
    (repository.language === undefined || typeof repository.language === "string") &&
    (repository.languageColor === undefined || typeof repository.languageColor === "string")
  );
}

export function usePinnedRepos(limit = 6): PinnedReposView {
  const [state, setState] = useState<State>({
    status: "loading",
    data: null,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const url = `${import.meta.env.BASE_URL}data/pinned.generated.json?t=${Date.now()}`;

        const res = await fetch(url, {
          signal: ac.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: unknown = await res.json();

        if (!Array.isArray(json) || !json.every(isPinnedRepo)) {
          throw new Error("Invalid JSON");
        }

        const data = json.slice(0, limit);

        setState({
          status: "success",
          data,
          error: null,
        });
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;

        setState({
          status: "error",
          data: null,
          error: "Enrichissement GitHub indisponible — données locales affichées.",
        });
      }
    })();

    return () => ac.abort();
  }, [limit]);

  const view = useMemo(() => {
    return {
      loading: state.status === "loading",
      available: state.status === "success",
      data: state.status === "success" ? state.data : [],
      error: state.status === "error" ? state.error : null,
    };
  }, [state]);

  return view;
}
