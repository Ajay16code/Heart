import { useState } from 'react';
import { Heart, ArrowRight, Scale } from 'lucide-react';

interface BMICalculatorProps {
  onNavigateToForm: () => void;
}

function BMICalculator({ onNavigateToForm }: BMICalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
      alert('Please enter valid weight and height values');
      return;
    }

    if (heightCm < 50 || heightCm > 300) {
      alert('Please enter a valid height between 50 and 300 cm');
      return;
    }

    if (weightKg < 20 || weightKg > 500) {
      alert('Please enter a valid weight between 20 and 500 kg');
      return;
    }

    const heightM = heightCm / 100;
    const bmiValue = weightKg / (heightM * heightM);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    let cat = '';
    if (bmiValue < 18.5) {
      cat = 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      cat = 'Healthy Weight';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      cat = 'Overweight';
    } else {
      cat = 'Obese';
    }
    setCategory(cat);
    setShowResult(true);
  };

  const handleGoToForm = () => {
    if (bmi !== null) {
      localStorage.setItem('user_bmi', bmi.toString());
    }
    onNavigateToForm();
  };

  const bmiCategories = [
    { range: 'Below 18.5', category: 'Underweight', color: 'text-blue-400' },
    { range: '18.5 - 24.9', category: 'Healthy Weight', color: 'text-green-400' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'text-yellow-400' },
    { range: '30.0 and above', category: 'Obese', color: 'text-red-400' },
  ];

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
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/70 to-black/80" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-center mb-8">
              <Scale className="w-12 h-12 text-red-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">BMI Calculator</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/90 border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                    placeholder="Enter your weight"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/90 border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                    placeholder="Enter your height"
                  />
                </div>

                <button
                  onClick={calculateBMI}
                  className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Calculate BMI
                </button>

                {showResult && bmi !== null && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="backdrop-blur-sm bg-white/20 border border-white/40 rounded-xl p-6">
                      <h3 className="text-white/80 text-sm font-semibold mb-2">Your BMI</h3>
                      <div className="text-6xl font-bold text-white mb-3">{bmi}</div>
                      <div className={`inline-block px-6 py-2 rounded-lg font-semibold text-lg ${
                        category === 'Underweight' ? 'bg-blue-500 text-white' :
                        category === 'Healthy Weight' ? 'bg-green-500 text-white' :
                        category === 'Overweight' ? 'bg-yellow-500 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {category}
                      </div>
                    </div>

                    <div className="backdrop-blur-sm bg-white/20 border border-white/40 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-2 text-lg">Healthy BMI Range</h4>
                      <p className="text-white/90 text-lg">18.5 - 24.9</p>
                      <p className="text-white/70 text-sm mt-2">
                        Maintaining a healthy BMI reduces risk of cardiovascular disease
                      </p>
                    </div>

                    <button
                      onClick={handleGoToForm}
                      className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    >
                      <span>Go to Patient Form</span>
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="backdrop-blur-sm bg-white/20 border border-white/40 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-500" fill="currentColor" />
                    BMI Categories
                  </h3>
                  <div className="space-y-4">
                    {bmiCategories.map((item, index) => (
                      <div
                        key={index}
                        className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-lg p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className={`font-bold text-lg ${item.color}`}>{item.category}</h4>
                            <p className="text-white/70 text-sm mt-1">BMI: {item.range}</p>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              item.category === 'Underweight'
                                ? 'bg-blue-400'
                                : item.category === 'Healthy Weight'
                                ? 'bg-green-400'
                                : item.category === 'Overweight'
                                ? 'bg-yellow-400'
                                : 'bg-red-400'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 backdrop-blur-sm bg-blue-500/20 border border-blue-500/50 rounded-xl">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Health Tip
                    </h4>
                    <p className="text-white/90 text-sm leading-relaxed">
                      BMI is a useful screening tool, but it doesn't directly measure body fat or account for muscle mass.
                      Consult with healthcare professionals for a comprehensive health assessment.
                    </p>
                  </div>

                  <div className="mt-4 p-4 backdrop-blur-sm bg-green-500/20 border border-green-500/50 rounded-xl">
                    <h4 className="text-white font-semibold mb-2">Healthy Living</h4>
                    <ul className="text-white/90 text-sm space-y-1">
                      <li>Regular physical activity (150 min/week)</li>
                      <li>Balanced diet with fruits and vegetables</li>
                      <li>Adequate sleep (7-9 hours/night)</li>
                      <li>Stress management and regular checkups</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BMICalculator;
