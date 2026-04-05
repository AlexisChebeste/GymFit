"use client"

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {

  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setValue(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Error reading localStorage", err);
    }
    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error saving localStorage", err);
    }
  }, [key, value, isLoaded]);

  return [value, setValue, isLoaded] as const;
}