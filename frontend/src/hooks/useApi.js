import { useCallback, useEffect, useState } from "react";
import api from "../services/api.js";

// GET with loading / error / reload. Pass null as path to skip.
export default function useApi(path, params) {
  const key = path ? path + JSON.stringify(params || {}) : null;
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) { setState({ data: null, loading: false, error: null }); return undefined; }
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api.get(path, { params })
      .then((r) => live && setState({ data: r.data, loading: false, error: null }))
      .catch((e) => live && setState({ data: null, loading: false, error: e }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { ...state, reload };
}
