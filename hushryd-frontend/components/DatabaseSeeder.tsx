import { useEffect } from 'react';
import { realDatabaseService } from '../services/realDatabaseService';

interface DatabaseSeederProps {
  autoSeed?: boolean;
}

export default function DatabaseSeeder({ autoSeed = false }: DatabaseSeederProps) {
  useEffect(() => {
    if (autoSeed) {
      // Check if database is empty and seed it
      const users = realDatabaseService.getAllAdminUsers();
      if (users.length === 0) {
        console.log('Database is empty, seeding with default users...');
        realDatabaseService.seedDatabase();
      }
    }
  }, [autoSeed]);

  return null; // This component doesn't render anything
}

// Function to manually seed the database
export const seedDatabase = () => {
  databaseService.seedDatabase();
  return databaseService.getAllUsers();
};

// Function to get database stats
export const getDatabaseStats = () => {
  return databaseService.getDatabaseStats();
};

// Function to clear database
export const clearDatabase = () => {
  databaseService.clearDatabase();
};

// Function to get all users
export const getAllUsers = () => {
  return databaseService.getAllUsers();
};

// Function to get users by role
export const getUsersByRole = (role: string) => {
  return databaseService.getUsersByRole(role);
};
