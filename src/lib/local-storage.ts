// Student data interface
export interface Student {
  id: string;
  nombre: string;
  saldo: number;
  fechaCreacion: string;
}

// Auth interface
export interface AuthData {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  STUDENTS: 'banco_munay_students',
  AUTH: 'banco_munay_auth',
} as const;

/**
 * Get students from localStorage
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
}

/**
 * Add a new student
 */
export function addStudent(nombre: string, montoInicial: number): Student {
  const newStudent: Student = {
    id: generateId(),
    nombre,
    saldo: montoInicial,
    fechaCreacion: new Date().toISOString(),
  };
  
  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  
  return newStudent;
}

/**
 * Get auth data from localStorage
 */
export function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { isAdmin: false, isLoggedIn: false };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isAdmin: false, isLoggedIn: false };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { isAdmin: false, isLoggedIn: false };
  }
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
}

/**
 * Login user
 */
export function login(isAdmin: boolean = true): void {
  saveAuthData({ isAdmin, isLoggedIn: true });
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
