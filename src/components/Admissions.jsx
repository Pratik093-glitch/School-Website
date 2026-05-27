import React, { useState, useEffect } from 'react';

const FEE_STRUCTURE = {
  'Pre-Primary': { admission: 12000, tuition: 2200, annual: 5000 },
  'Primary': { admission: 15000, tuition: 2800, annual: 8000 },
  'Middle': { admission: 18000, tuition: 3200, annual: 10000 },
  'Secondary': { admission: 20000, tuition: 3800, annual: 12000 },
  'Senior Science': { admission: 25000, tuition: 4500, annual: 15000 },
  'Senior Commerce': { admission: 22000, tuition: 4200, annual: 12000 }
};

const TRANSPORT_STRUCTURE = {
  'none': 0,
  'zoneA': 1200,
  'zoneB': 1500,
  'zoneC': 2000
};

export default function Admissions({ showToast }) {
  // --- ADMISSIONS WIZARD STATE ---
  const [wizardStep, setWizardStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentDOB, setStudentDOB] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [resAddress, setResAddress] = useState('');
  const [declarationChecked, setDeclarationChecked] = useState(false);

  // --- FEE ESTIMATOR STATE ---
  const [calcClass, setCalcClass] = useState('Primary');
  const [calcTransport, setCalcTransport] = useState('none');
  const [fees, setFees] = useState({ admission: 0, tuition: 0, annual: 0, transport: 0, total: 0 });

  // Update calculated fees automatically when parameters change
  useEffect(() => {
    const schoolFee = FEE_STRUCTURE[calcClass];
    const transportFee = TRANSPORT_STRUCTURE[calcTransport];

    if (schoolFee) {
      const totalOutlay = schoolFee.admission + schoolFee.tuition + schoolFee.annual + transportFee;
      setFees({
        admission: schoolFee.admission,
        tuition: schoolFee.tuition,
        annual: schoolFee.annual,
        transport: transportFee,
        total: totalOutlay
      });
    }
  }, [calcClass, calcTransport]);

  // --- WIZARD HANDLERS & VALIDATIONS ---
  const validateStep = (step) => {
    if (step === 1) {
      if (!studentName.trim() || !studentClass || !studentDOB) {
        showToast('Validation Error', 'Please complete all required student fields before continuing.', 'warning');
        return false;
      }
    } else if (step === 2) {
      if (!parentName.trim() || !parentPhone.trim() || !parentEmail.trim()) {
        showToast('Validation Error', 'Please enter parent name and complete contact details.', 'warning');
        return false;
      }
      if (!/^\d{10}$/.test(parentPhone.trim())) {
        showToast('Validation Error', 'Please enter a valid 10-digit mobile number.', 'warning');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim())) {
        showToast('Validation Error', 'Please specify a correct email structure.', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = (current) => {
    if (validateStep(current)) {
      setWizardStep(current + 1);
    }
  };

  const handlePrevStep = (current) => {
    setWizardStep(current - 1);
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();

    if (!resAddress.trim() || !declarationChecked) {
      showToast('Declaration Required', 'Please enter your address and check the declaration statement.', 'warning');
      return;
    }

    const payload = {
      studentName: studentName.trim(),
      studentClass,
      studentDOB,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      resAddress: resAddress.trim()
    };

    fetch('/api/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showToast(
            'Enquiry Submitted Successfully!',
            'Our admission database has logged your data. Administration will review it.',
            'success'
          );
          
          // Reset form fields
          setStudentName('');
          setStudentClass('');
          setStudentDOB('');
          setParentName('');
          setParentPhone('');
          setParentEmail('');
          setResAddress('');
          setDeclarationChecked(false);
          
          // Reset step
          setWizardStep(1);
        } else {
          showToast('Submission Failed', data.message || 'Error occurred during database submission.', 'danger');
        }
      })
      .catch(error => {
        console.error('Error submitting enquiry:', error);
        showToast('Network Error', 'Cannot reach backend server. Please ensure Express is running.', 'danger');
      });
  };

  return (
    <section className="admissions-section" id="admissions">
      <div className="admissions-grid">
        {/* Enquiry Wizard Card */}
        <div className="wizard-card">
          <div className="wizard-header">
            <span className="section-label">Enrolment 2026-27</span>
            <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Admission Enquiry Wizard</h2>
            <p className="section-subtitle" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
              Complete the steps below to register your school admission enquiry.
            </p>
          </div>

          {/* Step Indicators */}
          <div className="wizard-steps">
            <div 
              className="wizard-progress" 
              style={{ width: wizardStep === 1 ? '0%' : wizardStep === 2 ? '50%' : '100%' }}
            ></div>
            <div className={`step-indicator ${wizardStep === 1 ? 'active' : 'completed'}`}>1</div>
            <div className={`step-indicator ${wizardStep === 2 ? 'active' : wizardStep === 3 ? 'completed' : ''}`}>2</div>
            <div className={`step-indicator ${wizardStep === 3 ? 'active' : ''}`}>3</div>
          </div>

          {/* Form Elements */}
          <form id="enquiryForm" onSubmit={handleEnquirySubmit}>
            {/* Step 1: Student Details */}
            {wizardStep === 1 && (
              <div className="wizard-step active">
                <div className="form-group">
                  <label htmlFor="studentName">Student Full Name *</label>
                  <input 
                    type="text" 
                    id="studentName" 
                    placeholder="Enter student's full name" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="studentClass">Class Seeking *</label>
                    <select 
                      id="studentClass" 
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      required
                    >
                      <option value="">Select Target Class</option>
                      <option value="Pre-K">Pre-Kindergarten</option>
                      <option value="KG">Kindergarten</option>
                      <option value="Primary (I-V)">Primary (Grade I-V)</option>
                      <option value="Middle (VI-VIII)">Middle School (Grade VI-VIII)</option>
                      <option value="Senior (IX-XII)">Senior Secondary (Grade IX-XII)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentDOB">Date of Birth *</label>
                    <input 
                      type="date" 
                      id="studentDOB" 
                      value={studentDOB}
                      onChange={(e) => setStudentDOB(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="wizard-actions">
                  <span></span> {/* Empty span to push Next button right */}
                  <button type="button" className="btn btn-primary" onClick={() => handleNextStep(1)}>
                    Next Step <i className="ti ti-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Parent Details */}
            {wizardStep === 2 && (
              <div className="wizard-step active">
                <div className="form-group">
                  <label htmlFor="parentName">Father / Mother Name *</label>
                  <input 
                    type="text" 
                    id="parentName" 
                    placeholder="Enter parent's full name" 
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="parentPhone">Contact Mobile No *</label>
                    <input 
                      type="tel" 
                      id="parentPhone" 
                      placeholder="Enter 10-digit number" 
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="parentEmail">Email Address *</label>
                    <input 
                      type="email" 
                      id="parentEmail" 
                      placeholder="Enter email address" 
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="wizard-actions">
                  <button type="button" className="btn btn-outline" onClick={() => handlePrevStep(2)}>
                    <i className="ti ti-arrow-left"></i> Previous
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => handleNextStep(2)}>
                    Next Step <i className="ti ti-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Address & Declaration */}
            {wizardStep === 3 && (
              <div className="wizard-step active">
                <div className="form-group">
                  <label htmlFor="resAddress">Residential Address *</label>
                  <textarea 
                    id="resAddress" 
                    rows="3" 
                    placeholder="Enter complete home address" 
                    value={resAddress}
                    onChange={(e) => setResAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      id="declarationCheck" 
                      checked={declarationChecked}
                      onChange={(e) => setDeclarationChecked(e.target.checked)}
                      required 
                      style={{ width: 'auto', cursor: 'pointer' }} 
                    />
                    I declare that the information provided is correct.
                  </label>
                </div>
                <div className="wizard-actions">
                  <button type="button" className="btn btn-outline" onClick={() => handlePrevStep(3)}>
                    <i className="ti ti-arrow-left"></i> Previous
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="ti ti-circle-check"></i> Submit Enquiry
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Fee Estimator Calculator Card */}
        <div className="calc-card">
          <h3><i className="ti ti-calculator"></i> School Fee Estimator</h3>
          <p className="section-subtitle" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
            Select parameters below to dynamically calculate estimated academic fees.
          </p>

          <div className="calc-selectors">
            <div className="form-group">
              <label htmlFor="calcClass">Target Class *</label>
              <select 
                id="calcClass" 
                value={calcClass}
                onChange={(e) => setCalcClass(e.target.value)}
              >
                <option value="Pre-Primary">Pre-Kindergarten - KG</option>
                <option value="Primary">Primary (Grade I-V)</option>
                <option value="Middle">Middle School (Grade VI-VIII)</option>
                <option value="Secondary">Secondary (Grade IX-X)</option>
                <option value="Senior Science">Sr. Secondary Science (XI-XII)</option>
                <option value="Senior Commerce">Sr. Secondary Commerce (XI-XII)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="calcTransport">Transport Route *</label>
              <select 
                id="calcTransport" 
                value={calcTransport}
                onChange={(e) => setCalcTransport(e.target.value)}
              >
                <option value="none">No School Transport</option>
                <option value="zoneA">Zone A (Sector 1 to 5) (+ ₹1,200/mo)</option>
                <option value="zoneB">Zone B (Sector 6 to 12) (+ ₹1,500/mo)</option>
                <option value="zoneC">Zone C (Bokaro Suburbs) (+ ₹2,000/mo)</option>
              </select>
            </div>
          </div>

          {/* Calculation results breakdown */}
          <div className="calc-results">
            <div className="calc-row">
              <span>Admission / Registration Fee (One-Time)</span>
              <span id="feeAdmission">₹{fees.admission.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-row">
              <span>Monthly Tuition Fee</span>
              <span id="feeTuition">₹{fees.tuition.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="calc-row">
              <span>Annual Development & Lab Charges</span>
              <span id="feeAnnual">₹{fees.annual.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-row">
              <span>Monthly Transport Charges</span>
              <span id="feeTransport">₹{fees.transport.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="calc-row calc-total">
              <span>Estimated Initial Outlay</span>
              <span id="feeTotal">₹{fees.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
