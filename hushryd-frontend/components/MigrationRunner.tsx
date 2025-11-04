import { useEffect } from 'react';
import { migrationService } from '../utils/migrations';

interface MigrationRunnerProps {
  autoRun?: boolean;
}

export default function MigrationRunner({ autoRun = false }: MigrationRunnerProps) {
  useEffect(() => {
    if (autoRun) {
      console.log('🔄 Auto-running database migration...');
      
      // Check if we're in development mode
      if (__DEV__) {
        const result = migrationService.runInitialMigration();
        console.log('Migration result:', result);
      }
    }
  }, [autoRun]);

  return null; // This component doesn't render anything
}

// Export migration functions for console use
export const runMigration = () => {
  console.log('🌱 Running database migration...');
  const result = migrationService.runInitialMigration();
  console.log('Migration completed:', result);
  return result;
};

export const forceReseed = () => {
  console.log('🔄 Force re-seeding database...');
  const result = migrationService.forceReseed();
  console.log('Force re-seed completed:', result);
  return result;
};

export const checkStatus = () => {
  console.log('📊 Checking migration status...');
  const result = migrationService.getMigrationStatus();
  console.log('Migration status:', result);
  return result;
};

// Make functions available globally in development
if (__DEV__ && typeof window !== 'undefined') {
  (window as any).runMigration = runMigration;
  (window as any).forceReseed = forceReseed;
  (window as any).checkStatus = checkStatus;
  
  console.log('🛠️ Migration functions available in console:');
  console.log('  - runMigration() - Run initial migration');
  console.log('  - forceReseed() - Force re-seed database');
  console.log('  - checkStatus() - Check migration status');
}
