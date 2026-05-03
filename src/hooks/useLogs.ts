import { useCallback, useEffect, useState } from 'react';
import { logsService } from '../services/logs.service';
import type { LogType } from '../types';

export function useLogs(petId: string | undefined) {
  const [logs, setLogs] = useState<Awaited<
    ReturnType<typeof logsService.getLogsByPet>
  >>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(
    async (type?: string) => {
      if (!petId) return;
      setIsLoading(true);
      try {
        const res = await logsService.getLogsByPet(petId, {
          limit: 20,
          type,
        });
        setLogs(res);
      } catch (e) {
        console.error('Failed to fetch logs', e);
      } finally {
        setIsLoading(false);
      }
    },
    [petId],
  );

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const createLog = async (type: LogType, data: Record<string, unknown>) => {
    if (!petId) return;
    try {
      const res = await logsService.createLog({ petId, type, data });
      await fetchLogs();
      return res;
    } catch (e) {
      console.error('Failed to create log', e);
      throw e;
    }
  };

  return { logs, isLoading, fetchLogs, createLog };
}
