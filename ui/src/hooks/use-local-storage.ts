import { useState } from "react";

/**
 * Custom hook for managing localStorage with type safety
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue] - The stored value and setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing user preferences in localStorage
 */
export function useUserPreferences() {
  const [selectedStyle, setSelectedStyle] = useLocalStorage(
    "textcraft-style",
    "typo-grammar"
  );
  const [selectedPlatform, setSelectedPlatform] = useLocalStorage(
    "textcraft-platform",
    "email"
  );
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage(
    "textcraft-language",
    "en"
  );
  const [customLanguage, setCustomLanguage] = useLocalStorage(
    "textcraft-custom-language",
    ""
  );
  const [extraPrompt, setExtraPrompt] = useLocalStorage(
    "textcraft-extra-prompt",
    ""
  );

  // Clear all preferences
  const clearPreferences = () => {
    setSelectedStyle("typo-grammar");
    setSelectedPlatform("email");
    setSelectedLanguage("en");
    setCustomLanguage("");
    setExtraPrompt("");
  };

  return {
    selectedStyle,
    setSelectedStyle,
    selectedPlatform,
    setSelectedPlatform,
    selectedLanguage,
    setSelectedLanguage,
    customLanguage,
    setCustomLanguage,
    extraPrompt,
    setExtraPrompt,
    clearPreferences,
  };
}
