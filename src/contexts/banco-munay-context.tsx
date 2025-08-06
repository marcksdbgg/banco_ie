'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Student, 
  AuthData, 
  getStudents, 
  getAuthData, 
  saveAuthData, 
  addStudent as addStudentToStorage,
  updateStudent as updateStudentInStorage,
  deleteStudent as deleteStudentFromStorage,
  downloadStudentsCSV,
  uploadStudentsCSV,
  saveStudents
} from '@/lib/csv-storage';

interface ChitiBankContextType {
  // Students
  students: Student[];
  addStudent: (nombre: string, montoInicial: number) => void;
  updateStudent: (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => boolean;
  deleteStudent: (id: string) => boolean;
  refreshStudents: () => void;
  
  // CSV Operations
  exportToCSV: () => void;
  importFromCSV: () => Promise<void>;
  
  // Auth
  auth: AuthData;
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  
  // Loading
  loading: boolean;
}

const ChitiBankContext = createContext<ChitiBankContextType | undefined>(undefined);

export function BancoMunayProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [auth, setAuth] = useState<AuthData>({ isAdmin: false, isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      setStudents(getStudents());
      setAuth(getAuthData());
      setLoading(false);
    };

    initializeData();
  }, []);

  const refreshStudents = () => {
    setStudents(getStudents());
  };

  const addStudent = (nombre: string, montoInicial: number) => {
    const newStudent = addStudentToStorage(nombre, montoInicial);
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => {
    const updatedStudent = updateStudentInStorage(id, updates);
    if (updatedStudent) {
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return true;
    }
    return false;
  };

  const deleteStudent = (id: string) => {
    const success = deleteStudentFromStorage(id);
    if (success) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
    return success;
  };

  const exportToCSV = () => {
    downloadStudentsCSV(students);
  };

  const importFromCSV = async () => {
    try {
      const importedStudents = await uploadStudentsCSV();
      saveStudents(importedStudents);
      setStudents(importedStudents);
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  };

  const login = (isAdmin: boolean = true) => {
    const authData = { isAdmin, isLoggedIn: true };
    saveAuthData(authData);
    setAuth(authData);
  };

  const logout = () => {
    const authData = { isAdmin: false, isLoggedIn: false };
    saveAuthData(authData);
    setAuth(authData);
  };

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
    exportToCSV,
    importFromCSV,
    auth,
    login,
    logout,
    loading,
  };

  return (
  <ChitiBankContext.Provider value={value}>
      {children}
  </ChitiBankContext.Provider>
  );
}

export function useBancoMunay() {
  const context = useContext(ChitiBankContext);
  if (context === undefined) {
    throw new Error('useBancoMunay must be used within a BancoMunayProvider');
  }
  return context;
}
