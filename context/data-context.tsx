import React, { createContext, useState, useCallback, useContext } from 'react';
import { useCreds } from '../hooks/use-creds';
import { fetchGrades, fetchCourses, GradeEntry } from '../services/hac-api';
import { Course } from '../utils/gpa-calculator';

interface DataCache {
  grades: GradeEntry[] | null;
  courses: Course[] | null;
  loading: boolean;
  error: string | null;
}

interface DataContextType {
  cache: DataCache;
  loadGradesAndCourses: () => Promise<void>;
  clearCache: () => void;
}

export const DataContext = createContext<DataContextType | null>(null);

// shared cache prevents duplicate HAC API calls across screens
export function DataProvider({ children }: { children: React.ReactNode }) {
  const creds = useCreds();
  const [cache, setCache] = useState<DataCache>({
    grades: null,
    courses: null,
    loading: false,
    error: null,
  });

  const loadGradesAndCourses = useCallback(async () => {
    if (!creds) return;
    if (cache.grades && cache.courses) return; // already cached

    try {
      setCache((prev) => ({ ...prev, loading: true, error: null }));
      // single fetch, derive both grades and courses
      const grades = await fetchGrades(creds.hacUrl, creds.username, creds.password);
      const courses = await fetchCourses(creds.hacUrl, creds.username, creds.password, grades);
      setCache({ grades, courses, loading: false, error: null });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to load data';
      setCache((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [creds, cache.grades, cache.courses]);

  const clearCache = useCallback(() => {
    setCache({ grades: null, courses: null, loading: false, error: null });
  }, []);

  return (
    <DataContext.Provider value={{ cache, loadGradesAndCourses, clearCache }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataCache() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataCache must be used within DataProvider');
  }
  return context;
}
