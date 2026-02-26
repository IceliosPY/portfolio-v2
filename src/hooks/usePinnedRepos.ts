import { useEffect, useMemo, useRef, useState } from "react";
import type { PinnedRepo } from "../types/pinned";

type State =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: PinnedRepo[]; error: null }
  | { status: "error"; data: null; error: string };

export function usePinnedRepos(limit = 6) {
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

        const json = await res.json();

        if (!Array.isArray(json)) {
          throw new Error("Invalid JSON");
        }

        const data = json.slice(0, limit);

        setState({
          status: "success",
          data,
          error: null,
        });
      } catch (e: any) {
        if (e?.name === "AbortError") return;

        setState({
          status: "error",
          data: null,
          error: "Impossible de charger les projets épinglés.",
        });
      }
    })();

    return () => ac.abort();
  }, [limit]);

  const view = useMemo(() => {
    return {
      loading: state.status === "loading",
      data: state.status === "success" ? state.data : [],
      error: state.status === "error" ? state.error : null,
    };
  }, [state]);

  return view;
}