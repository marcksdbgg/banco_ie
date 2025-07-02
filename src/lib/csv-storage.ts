// CSV file management for students data
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

// Local Storage Keys (mantenemos para auth)
export const STORAGE_KEYS = {
  AUTH: 'banco_munay_auth',
} as const;

// CSV Headers
const CSV_HEADERS = 'id,nombre,saldo,fechaCreacion';

/**
 * Convert students array to CSV format
 */
export function studentsToCSV(students: Student[]): string {
  const csvRows = [CSV_HEADERS];
  
  for (const student of students) {
    const row = [
      student.id,
      `"${student.nombre}"`, // Quoted to handle names with commas
      student.saldo.toString(),
      student.fechaCreacion
    ].join(',');
    csvRows.push(row);
  }
  
  return csvRows.join('\n');
}

/**
 * Parse CSV content to students array
 */
export function csvToStudents(csvContent: string): Student[] {
  const lines = csvContent.trim().split('\n');
  
  // Skip header row
  if (lines.length <= 1) return [];
  
  const students: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles quoted fields)
    const fields = parseCSVLine(line);
    
    if (fields.length >= 4) {
      students.push({
        id: fields[0],
        nombre: fields[1].replace(/^"|"$/g, ''), // Remove quotes
        saldo: parseFloat(fields[2]) || 0,
        fechaCreacion: fields[3]
      });
    }
  }
  
  return students;
}

/**
 * Simple CSV line parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current);
  return fields;
}

/**
 * Download CSV file with students data
 */
export function downloadStudentsCSV(students: Student[]): void {
  const csvContent = studentsToCSV(students);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `banco_munay_alumnos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload and parse CSV file
 */
export function uploadStudentsCSV(): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const students = csvToStudents(csvContent);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
}

/**
 * Get students from localStorage (fallback) or return empty array
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('banco_munay_students');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage (fallback)
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('banco_munay_students', JSON.stringify(students));
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
 * Update an existing student
 */
export function updateStudent(id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>): Student | null {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  students[index] = {
    ...students[index],
    ...updates
  };
  
  saveStudents(students);
  return students[index];
}

/**
 * Delete a student
 */
export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const initialLength = students.length;
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (filteredStudents.length === initialLength) {
    return false; // Student not found
  }
  
  saveStudents(filteredStudents);
  return true;
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
  localStorage.removeItem('banco_munay_students');
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format currency in Soles
 */
export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
