export interface StoredError {
  message: string;
  stack?: string;
  timestamp: string;
}

// Save the last error
export const saveError = (error: StoredError) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lastError', JSON.stringify(error));
  }
};

// Get the last saved error
export const getLastError = (): StoredError | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('lastError');
  return data ? JSON.parse(data) : null;
};

// Clear saved error
export const clearError = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lastError');
  }
};