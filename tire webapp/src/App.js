import React, { useState, useEffect } from 'react';
import './App.css';
import vehicleData from './data/vehicles.json';

function App() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [trims, setTrims] = useState([]);
  
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize makes on component mount
  useEffect(() => {
    const uniqueMakes = [...new Set(vehicleData.map(vehicle => vehicle.make))].sort();
    setMakes(uniqueMakes);
  }, []);

  // Update models when make changes
  useEffect(() => {
    if (selectedMake) {
      const filteredModels = [...new Set(
        vehicleData
          .filter(vehicle => vehicle.make === selectedMake)
          .map(vehicle => vehicle.model)
      )].sort();
      
      setModels(filteredModels);
      setSelectedModel('');
      setSelectedYear('');
      setSelectedTrim('');
      setYears([]);
      setTrims([]);
    }
  }, [selectedMake]);

  // Update years when model changes
  useEffect(() => {
    if (selectedModel) {
      const filteredYears = [...new Set(
        vehicleData
          .filter(vehicle => vehicle.make === selectedMake && vehicle.model === selectedModel)
          .map(vehicle => vehicle.year)
      )].sort((a, b) => b - a); // Sort years in descending order
      
      setYears(filteredYears);
      setSelectedYear('');
      setSelectedTrim('');
      setTrims([]);
    }
  }, [selectedModel, selectedMake]);

  // Update trims when year changes
  useEffect(() => {
    if (selectedYear) {
      const filteredTrims = [...new Set(
        vehicleData
          .filter(vehicle => 
            vehicle.make === selectedMake && 
            vehicle.model === selectedModel && 
            vehicle.year === parseInt(selectedYear)
          )
          .map(vehicle => vehicle.trim)
      )].sort();
      
      setTrims(filteredTrims);
      setSelectedTrim('');
    }
  }, [selectedYear, selectedModel, selectedMake]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Find the selected vehicle
    const selectedVehicle = vehicleData.find(vehicle => 
      vehicle.make === selectedMake &&
      vehicle.model === selectedModel &&
      vehicle.year === parseInt(selectedYear) &&
      vehicle.trim === selectedTrim
    );
    
    if (selectedVehicle) {
      // Calculate the largest wheel size that will fit without modification
      const largestWheelSize = calculateLargestWheelSize(selectedVehicle);
      
      setResults({
        vehicle: selectedVehicle,
        largestWheelSize
      });
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 500); // Add a small delay to show loading state
  };

  const calculateLargestWheelSize = (vehicle) => {
    // Extract the factory wheel size from the vehicle data
    const factoryWheelSize = vehicle.wheelSize;
    
    // Calculate the largest wheel size that will fit without modification
    // This would typically involve more complex calculations based on wheel well dimensions,
    // suspension geometry, etc.
    const maxWheelSize = Math.min(factoryWheelSize + 2, 24);
    
    return maxWheelSize;
  };

  const isFormValid = selectedMake && selectedModel && selectedYear && selectedTrim;

  return (
    <div className="App">
      <div className="header">
        <h1>LiteOme Wheel Size Calculator</h1>
        <p>Find the perfect wheel size for your vehicle</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select 
              id="make" 
              value={selectedMake} 
              onChange={(e) => setSelectedMake(e.target.value)}
              required
            >
              <option value="">Select Make</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select 
              id="model" 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              required
            >
              <option value="">Select Model</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select 
              id="year" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
              required
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="trim">Trim</label>
            <select 
              id="trim" 
              value={selectedTrim} 
              onChange={(e) => setSelectedTrim(e.target.value)}
              disabled={!selectedYear}
              required
            >
              <option value="">Select Trim</option>
              {trims.map(trim => (
                <option key={trim} value={trim}>{trim}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!isFormValid || loading}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      </div>
      
      {results && (
        <div className="results">
          <h2>Results for {results.vehicle.year} {results.vehicle.make} {results.vehicle.model} {results.vehicle.trim}</h2>
          
          <div className="result-section">
            <h3>Factory Specifications</h3>
            <div className="result-item">
              <span className="result-label">Factory Wheel Size:</span>
              <span className="result-value">{results.vehicle.wheelSize}" inches</span>
            </div>
            <div className="result-item">
              <span className="result-label">Factory Tire Size:</span>
              <span className="result-value">{results.vehicle.tireSize}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Bolt Pattern:</span>
              <span className="result-value">{results.vehicle.boltPattern}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Offset:</span>
              <span className="result-value">{results.vehicle.offset} mm</span>
            </div>
          </div>
          
          <div className="result-section highlight">
            <h3>Maximum Wheel Size Without Modification</h3>
            <div className="result-item">
              <span className="result-label">Largest Wheel Size:</span>
              <span className="result-value">{results.largestWheelSize}" inches</span>
            </div>
            <p>This is the largest wheel size that will fit your vehicle without requiring any modifications.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;