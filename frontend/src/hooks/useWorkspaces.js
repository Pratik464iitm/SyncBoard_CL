import { useCallback, useEffect, useState } from "react";
import { getWorkspaces } from "../services/resources";

const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return getWorkspaces()
      .then(setWorkspaces)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { workspaces, loading, reload, setWorkspaces };
};

export default useWorkspaces;
