import { createContext, useState, useContext, useCallback } from "react";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  // Global full-page loader (e.g. while fetching user on mount)
  const [isLoading, setIsLoading] = useState(false);

  // Per-action button loaders keyed by a string id
  // e.g. { "login": true, "signup": false }
  const [actionLoading, setActionLoading] = useState({});

  /** Show/hide the full-page overlay loader */
  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  /**
   * Wrap an async function with a named button loader.
   * Usage:  withLoader("login", async () => { ... })
   */
  const withLoader = useCallback(async (key, asyncFn) => {
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      return await asyncFn();
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  /** Returns true if the named action is currently loading */
  const isActionLoading = useCallback(
    (key) => !!actionLoading[key],
    [actionLoading]
  );

  return (
    <LoaderContext.Provider
      value={{ isLoading, showLoader, hideLoader, withLoader, isActionLoading }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

/** Convenience hook */
export const useLoader = () => useContext(LoaderContext);
