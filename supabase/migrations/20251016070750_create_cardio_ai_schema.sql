/*
  # Cardio AI Database Schema

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `patient_id` (text, unique identifier)
      - `name` (text)
      - `dob` (date)
      - `sex` (text)
      - `height` (numeric, cm)
      - `weight` (numeric, kg)
      - `bmi` (numeric, calculated)
      - `contact` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `clinical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `record_id` (text, unique)
      - `record_date` (date)
      - `systolic` (integer, mmHg)
      - `diastolic` (integer, mmHg)
      - `resting_hr` (integer, bpm)
      - `fasting_bs` (numeric, mg/dL)
      - `troponin` (numeric, ng/mL)
      - `creatinine` (numeric, mg/dL)
      - `ldl` (numeric, mg/dL)
      - `hdl` (numeric, mg/dL)
      - `total_cholesterol` (numeric, mg/dL)
      - `triglycerides` (numeric, mg/dL)
      - `created_at` (timestamptz)

    - `ecg_reports`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `clinical_record_id` (uuid, foreign key to clinical_records)
      - `report_name` (text)
      - `report_url` (text, storage path)
      - `file_type` (text)
      - `file_size` (integer, bytes)
      - `heart_rate` (integer, bpm)
      - `pr_interval` (integer, ms)
      - `qrs_duration` (integer, ms)
      - `qt_interval` (integer, ms)
      - `qtc_interval` (integer, ms)
      - `interpretation` (text)
      - `abnormalities` (text)
      - `uploaded_at` (timestamptz)

    - `ai_predictions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `clinical_record_id` (uuid, foreign key to clinical_records)
      - `risk_percentage` (numeric)
      - `severity` (text)
      - `recommended_action` (text)
      - `medicine_suggestion` (text)
      - `diet_advice` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demo purposes)
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text UNIQUE NOT NULL,
  name text NOT NULL,
  dob date,
  sex text,
  height numeric,
  weight numeric,
  bmi numeric,
  contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  record_id text UNIQUE NOT NULL,
  record_date date,
  systolic integer,
  diastolic integer,
  resting_hr integer,
  fasting_bs numeric,
  troponin numeric,
  creatinine numeric,
  ldl numeric,
  hdl numeric,
  total_cholesterol numeric,
  triglycerides numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecg_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  clinical_record_id uuid REFERENCES clinical_records(id) ON DELETE CASCADE,
  report_name text NOT NULL,
  report_url text,
  file_type text,
  file_size integer,
  heart_rate integer,
  pr_interval integer,
  qrs_duration integer,
  qt_interval integer,
  qtc_interval integer,
  interpretation text,
  abnormalities text,
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  clinical_record_id uuid REFERENCES clinical_records(id) ON DELETE CASCADE,
  risk_percentage numeric NOT NULL,
  severity text NOT NULL,
  recommended_action text,
  medicine_suggestion text,
  diet_advice text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to patients"
  ON patients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to patients"
  ON patients FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to patients"
  ON patients FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to clinical_records"
  ON clinical_records FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to clinical_records"
  ON clinical_records FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access to ecg_reports"
  ON ecg_reports FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to ecg_reports"
  ON ecg_reports FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access to ai_predictions"
  ON ai_predictions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to ai_predictions"
  ON ai_predictions FOR INSERT
  TO public
  WITH CHECK (true);
