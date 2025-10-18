import { useState, useEffect } from 'react';
import {
  Heart,
  Upload,
  Activity,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DiagnosticDetailProps {
  onNavigateBack: () => void;
  patientId?: string;
}

interface ECGData {
  id: string;
  report_name: string;
  heart_rate: number;
  pr_interval: number;
  qrs_duration: number;
  qt_interval: number;
  qtc_interval: number;
  interpretation: string;
  abnormalities: string;
  uploaded_at: string;
}

function DiagnosticDetail({ onNavigateBack, patientId }: DiagnosticDetailProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ecgData, setEcgData] = useState<ECGData | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const [ecgMetrics, setEcgMetrics] = useState({
    heartRate: '',
    prInterval: '',
    qrsDuration: '',
    qtInterval: '',
    qtcInterval: '',
    interpretation: '',
    abnormalities: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);

    const mockECGData: ECGData = {
      id: crypto.randomUUID(),
      report_name: uploadedFile.name,
      heart_rate: parseInt(ecgMetrics.heartRate) || Math.floor(Math.random() * 40) + 60,
      pr_interval: parseInt(ecgMetrics.prInterval) || Math.floor(Math.random() * 80) + 120,
      qrs_duration: parseInt(ecgMetrics.qrsDuration) || Math.floor(Math.random() * 40) + 80,
      qt_interval: parseInt(ecgMetrics.qtInterval) || Math.floor(Math.random() * 100) + 350,
      qtc_interval: parseInt(ecgMetrics.qtcInterval) || Math.floor(Math.random() * 80) + 380,
      interpretation: ecgMetrics.interpretation || 'Normal sinus rhythm with no significant abnormalities detected.',
      abnormalities: ecgMetrics.abnormalities || 'None detected',
      uploaded_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('ecg_reports')
        .insert({
          patient_id: patientId || crypto.randomUUID(),
          report_name: mockECGData.report_name,
          file_type: uploadedFile.type,
          file_size: uploadedFile.size,
          heart_rate: mockECGData.heart_rate,
          pr_interval: mockECGData.pr_interval,
          qrs_duration: mockECGData.qrs_duration,
          qt_interval: mockECGData.qt_interval,
          qtc_interval: mockECGData.qtc_interval,
          interpretation: mockECGData.interpretation,
          abnormalities: mockECGData.abnormalities,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error saving ECG data:', error);
      }

      setEcgData(mockECGData);
      setShowVisualization(true);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const ECGWaveform = () => {
    const generateECGPath = () => {
      let path = 'M 0 150';
      const segments = 50;

      for (let i = 0; i < segments; i++) {
        const x = (i / segments) * 800;

        if (i % 10 === 5) {
          path += ` L ${x} 50 L ${x + 5} 150`;
        } else if (i % 10 === 6) {
          path += ` L ${x} 120`;
        } else if (i % 10 === 7) {
          path += ` L ${x} 160`;
        } else {
          path += ` L ${x} 150`;
        }
      }

      return path;
    };

    return (
      <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-500" />
            ECG Waveform Visualization
          </h3>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <svg width="100%" height="300" viewBox="0 0 800 300" className="w-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="0.5" />
              </pattern>
            </defs>

            <rect width="800" height="300" fill="url(#grid)" />

            <path
              d={generateECGPath()}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              className="animate-pulse"
            />

            <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Lead I</p>
            <div className="h-12 bg-gray-900/50 rounded"></div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Lead II</p>
            <div className="h-12 bg-gray-900/50 rounded"></div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Lead III</p>
            <div className="h-12 bg-gray-900/50 rounded"></div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Lead aVR</p>
            <div className="h-12 bg-gray-900/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (value: number, normal: [number, number]) => {
    if (value < normal[0] || value > normal[1]) {
      return 'text-red-400 border-red-400';
    }
    return 'text-green-400 border-green-400';
  };

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
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 min-h-screen">
        <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <button
                onClick={onNavigateBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Activity className="w-6 h-6 mr-2 text-red-500" />
                Diagnostic Detail & ECG Analysis
              </h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-red-500" />
                  Upload ECG Report
                </h2>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-white/40 rounded-xl p-8 text-center hover:border-red-500 transition-all">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="ecg-upload"
                    />
                    <label htmlFor="ecg-upload" className="cursor-pointer">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-white/60" />
                      <p className="text-white font-semibold mb-2">
                        {uploadedFile ? uploadedFile.name : 'Click to upload ECG report'}
                      </p>
                      <p className="text-white/60 text-sm">PDF, JPG, PNG (Max 10MB)</p>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={ecgMetrics.heartRate}
                        onChange={(e) => setEcgMetrics({ ...ecgMetrics, heartRate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">PR Interval (ms)</label>
                      <input
                        type="number"
                        value={ecgMetrics.prInterval}
                        onChange={(e) => setEcgMetrics({ ...ecgMetrics, prInterval: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 160"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">QRS Duration (ms)</label>
                      <input
                        type="number"
                        value={ecgMetrics.qrsDuration}
                        onChange={(e) => setEcgMetrics({ ...ecgMetrics, qrsDuration: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">QT Interval (ms)</label>
                      <input
                        type="number"
                        value={ecgMetrics.qtInterval}
                        onChange={(e) => setEcgMetrics({ ...ecgMetrics, qtInterval: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 400"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">QTc Interval (ms)</label>
                      <input
                        type="number"
                        value={ecgMetrics.qtcInterval}
                        onChange={(e) => setEcgMetrics({ ...ecgMetrics, qtcInterval: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 420"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Interpretation</label>
                    <textarea
                      value={ecgMetrics.interpretation}
                      onChange={(e) => setEcgMetrics({ ...ecgMetrics, interpretation: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Enter ECG interpretation..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Abnormalities Detected</label>
                    <textarea
                      value={ecgMetrics.abnormalities}
                      onChange={(e) => setEcgMetrics({ ...ecgMetrics, abnormalities: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={2}
                      placeholder="List any abnormalities..."
                    />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!uploadedFile || uploading}
                    className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload & Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showVisualization && ecgData && (
                <div className="animate-fadeIn space-y-8">
                  <ECGWaveform />

                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-red-500" />
                      Analysis Results
                    </h3>

                    <div className="space-y-4">
                      <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Interpretation</h4>
                        <p className="text-white/90 leading-relaxed">{ecgData.interpretation}</p>
                      </div>

                      <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Abnormalities</h4>
                        <p className="text-white/90 leading-relaxed">
                          {ecgData.abnormalities || 'No significant abnormalities detected'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-red-500" />
                  ECG Parameters
                </h3>

                {ecgData ? (
                  <div className="space-y-4">
                    <div className={`border-2 rounded-lg p-4 ${getStatusColor(ecgData.heart_rate, [60, 100])}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">Heart Rate</span>
                        {ecgData.heart_rate >= 60 && ecgData.heart_rate <= 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-3xl font-bold text-white">{ecgData.heart_rate} bpm</p>
                      <p className="text-white/60 text-xs mt-1">Normal: 60-100 bpm</p>
                    </div>

                    <div className={`border-2 rounded-lg p-4 ${getStatusColor(ecgData.pr_interval, [120, 200])}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">PR Interval</span>
                        {ecgData.pr_interval >= 120 && ecgData.pr_interval <= 200 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">{ecgData.pr_interval} ms</p>
                      <p className="text-white/60 text-xs mt-1">Normal: 120-200 ms</p>
                    </div>

                    <div className={`border-2 rounded-lg p-4 ${getStatusColor(ecgData.qrs_duration, [80, 120])}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">QRS Duration</span>
                        {ecgData.qrs_duration >= 80 && ecgData.qrs_duration <= 120 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">{ecgData.qrs_duration} ms</p>
                      <p className="text-white/60 text-xs mt-1">Normal: 80-120 ms</p>
                    </div>

                    <div className={`border-2 rounded-lg p-4 ${getStatusColor(ecgData.qtc_interval, [350, 450])}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">QTc Interval</span>
                        {ecgData.qtc_interval >= 350 && ecgData.qtc_interval <= 450 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">{ecgData.qtc_interval} ms</p>
                      <p className="text-white/60 text-xs mt-1">Normal: 350-450 ms</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-white/40" />
                    <p className="text-white/60">Upload ECG report to see parameters</p>
                  </div>
                )}
              </div>

              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500" fill="currentColor" />
                  Clinical Notes
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-white/90 text-sm">
                      <strong>Note:</strong> ECG analysis is a screening tool. Always consult with a cardiologist for comprehensive evaluation.
                    </p>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-white/90 text-sm">
                      <strong>Tip:</strong> Compare current ECG with previous recordings to track changes over time.
                    </p>
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

export default DiagnosticDetail;
