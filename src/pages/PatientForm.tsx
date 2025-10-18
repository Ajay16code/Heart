import { useState, useEffect } from 'react';
import { Heart, Calculator, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface PatientFormProps {
  onNavigateToBMI: () => void;
  onNavigateToDiagnostic: () => void;
}

interface FormData {
  patientId: string;
  name: string;
  dob: string;
  sex: string;
  height: string;
  weight: string;
  bmi: string;
  contact: string;
  recordId: string;
  recordDate: string;
  systolic: string;
  diastolic: string;
  restingHR: string;
  fastingBS: string;
  troponin: string;
  creatinine: string;
  ldl: string;
  hdl: string;
  totalCholesterol: string;
  triglycerides: string;
}

interface PredictionResult {
  riskPercentage: number;
  severity: 'Low' | 'Moderate' | 'High';
  action: string;
  medicine: string;
  diet: string;
}

function PatientForm({ onNavigateToBMI, onNavigateToDiagnostic }: PatientFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    patientId: '',
    name: '',
    dob: '',
    sex: '',
    height: '',
    weight: '',
    bmi: '',
    contact: '',
    recordId: '',
    recordDate: '',
    systolic: '',
    diastolic: '',
    restingHR: '',
    fastingBS: '',
    troponin: '',
    creatinine: '',
    ldl: '',
    hdl: '',
    totalCholesterol: '',
    triglycerides: '',
  });

  useEffect(() => {
    const storedBMI = localStorage.getItem('user_bmi');
    if (storedBMI) {
      setFormData(prev => ({ ...prev, bmi: storedBMI }));
      localStorage.removeItem('user_bmi');
    }
  }, []);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightM = parseFloat(formData.height) / 100;
      const weightKg = parseFloat(formData.weight);
      if (heightM > 0 && weightKg > 0) {
        const bmiValue = (weightKg / (heightM * heightM)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi: bmiValue }));
      }
    }
  }, [formData.height, formData.weight]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const riskPercentage = Math.floor(Math.random() * 100);
    let severity: 'Low' | 'Moderate' | 'High' = 'Low';
    let action = '';
    let medicine = '';
    let diet = '';

    if (riskPercentage < 30) {
      severity = 'Low';
      action = 'Continue regular checkups. Maintain healthy lifestyle.';
      medicine = 'No immediate medication required. Consider preventive supplements.';
      diet = 'Balanced diet rich in fruits, vegetables, and whole grains. Limit sodium intake.';
    } else if (riskPercentage < 70) {
      severity = 'Moderate';
      action = 'Schedule follow-up appointment. Monitor cardiovascular health closely.';
      medicine = 'Low-dose aspirin, Statin therapy (e.g., Atorvastatin 10-20mg). Consult cardiologist.';
      diet = 'Low-fat, low-sodium diet. Increase omega-3 fatty acids. Reduce processed foods.';
    } else {
      severity = 'High';
      action = 'URGENT: Immediate consultation with cardiologist required. Consider hospitalization for monitoring.';
      medicine = 'Beta-blockers, ACE inhibitors, High-dose statins, Antiplatelet therapy. Immediate cardiology referral.';
      diet = 'Strict cardiac diet: Very low sodium (<1500mg/day), low saturated fat, high fiber. Nutritionist consultation.';
    }

    setResult({
      riskPercentage,
      severity,
      action,
      medicine,
      diet,
    });
    setShowResult(true);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => ((currentStep / 4) * 100);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://www.shutterstock.com/image-vector/abstract-red-human-heart-anatomy-260nw-2324709281.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 min-h-screen">
        <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full border-2 border-red-500 overflow-hidden bg-white shadow-lg">
                  <Heart className="w-full h-full p-2 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500" fill="currentColor" />
                  Cardio AI Decision Support System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onNavigateToDiagnostic}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/30"
                >
                  <Activity className="w-5 h-5" />
                  <span>ECG Analysis</span>
                </button>
                <button
                  onClick={onNavigateToBMI}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Calculator className="w-5 h-5" />
                  <span>BMI Calculator</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-white">Step {currentStep} of 4</h2>
                <span className="text-sm text-white/80">{getStepProgress().toFixed(0)}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress()}%` }}
                />
              </div>
            </div>

            <div className="animate-fadeIn">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Patient ID</label>
                      <input
                        type="text"
                        value={formData.patientId}
                        onChange={(e) => handleInputChange('patientId', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter patient ID"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Sex</label>
                      <select
                        value={formData.sex}
                        onChange={(e) => handleInputChange('sex', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter height in cm"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter weight in kg"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">BMI (Auto-calculated)</label>
                      <input
                        type="text"
                        value={formData.bmi}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/50 text-gray-700 font-semibold cursor-not-allowed"
                        placeholder="Auto-calculated"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Contact</label>
                      <input
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Clinical Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Record ID</label>
                      <input
                        type="text"
                        value={formData.recordId}
                        onChange={(e) => handleInputChange('recordId', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter record ID"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Record Date</label>
                      <input
                        type="date"
                        value={formData.recordDate}
                        onChange={(e) => handleInputChange('recordDate', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Systolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={formData.systolic}
                        onChange={(e) => handleInputChange('systolic', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 120"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Diastolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={formData.diastolic}
                        onChange={(e) => handleInputChange('diastolic', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 80"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Resting Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={formData.restingHR}
                        onChange={(e) => handleInputChange('restingHR', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Fasting Blood Sugar (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.fastingBS}
                        onChange={(e) => handleInputChange('fastingBS', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Troponin (ng/mL)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.troponin}
                        onChange={(e) => handleInputChange('troponin', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 0.02"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Creatinine (mg/dL)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.creatinine}
                        onChange={(e) => handleInputChange('creatinine', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 1.0"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">LDL Cholesterol (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.ldl}
                        onChange={(e) => handleInputChange('ldl', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">HDL Cholesterol (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.hdl}
                        onChange={(e) => handleInputChange('hdl', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Total Cholesterol (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.totalCholesterol}
                        onChange={(e) => handleInputChange('totalCholesterol', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 180"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Triglycerides (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.triglycerides}
                        onChange={(e) => handleInputChange('triglycerides', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., 150"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Additional Information</h3>
                  <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-8 text-center">
                    <p className="text-white text-lg">Step 3 - To be implemented</p>
                    <p className="text-white/70 mt-2">Additional clinical data and patient history</p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Review & Submit</h3>
                  <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-8 text-center">
                    <p className="text-white text-lg">Step 4 - To be implemented</p>
                    <p className="text-white/70 mt-2">Review all information before submission</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>{currentStep === 4 ? 'Submit' : 'Next'}</span>
                {currentStep !== 4 && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {showResult && result && (
            <div className="mt-8 backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 animate-fadeIn">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Heart className="w-8 h-8 mr-3 text-red-500" fill="currentColor" />
                AI Analysis Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Heart Attack Risk</h4>
                  <div className="text-5xl font-bold text-white mb-2">{result.riskPercentage}%</div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.severity === 'Low'
                          ? 'bg-green-500'
                          : result.severity === 'Moderate'
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${result.riskPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Severity Level</h4>
                  <div
                    className={`inline-block px-6 py-3 rounded-lg text-2xl font-bold ${
                      result.severity === 'Low'
                        ? 'bg-green-500 text-white'
                        : result.severity === 'Moderate'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {result.severity}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Recommended Action</h4>
                  <p className="text-white/90 leading-relaxed">{result.action}</p>
                </div>

                <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Medicine Suggestion</h4>
                  <p className="text-white/90 leading-relaxed">{result.medicine}</p>
                </div>

                <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Diet Advice</h4>
                  <p className="text-white/90 leading-relaxed">{result.diet}</p>
                </div>
              </div>

              <div className="mt-6 p-4 backdrop-blur-sm bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-white/90 text-sm">
                  <strong>Disclaimer:</strong> This is a simulated AI prediction for demonstration purposes only.
                  Always consult with qualified healthcare professionals for actual medical advice and treatment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientForm;
