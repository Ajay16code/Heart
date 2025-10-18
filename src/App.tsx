import { useState } from 'react';
import PatientForm from './pages/PatientForm';
import BMICalculator from './pages/BMICalculator';
import DiagnosticDetail from './pages/DiagnosticDetail';

type PageType = 'form' | 'bmi' | 'diagnostic';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('form');

  return (
    <div className="min-h-screen">
      {currentPage === 'form' ? (
        <PatientForm
          onNavigateToBMI={() => setCurrentPage('bmi')}
          onNavigateToDiagnostic={() => setCurrentPage('diagnostic')}
        />
      ) : currentPage === 'bmi' ? (
        <BMICalculator onNavigateToForm={() => setCurrentPage('form')} />
      ) : (
        <DiagnosticDetail onNavigateBack={() => setCurrentPage('form')} />
      )}
    </div>
  );
}

export default App;
