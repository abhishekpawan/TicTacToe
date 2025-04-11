// This file contains module declarations to fix import issues
declare module '../components/Board/Cell' {
  import { FC } from 'react';
  
  interface CellProps {
    value: string | null;
    index: number;
    onClick: () => void;
    isActive: boolean;
  }
  
  const Cell: FC<CellProps>;
  export default Cell;
} 