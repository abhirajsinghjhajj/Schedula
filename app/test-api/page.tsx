"use client";

import { useEffect, useState } from "react";

export default function TestAPIPage() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError("");

      // Test doctors API
      const doctorsResponse = await fetch('/api/doctors');
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
      } else {
        throw new Error(`Doctors API failed: ${doctorsResponse.status}`);
      }

      // Test patients API
      const patientsResponse = await fetch('/api/patients');
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
      } else {
        throw new Error(`Patients API failed: ${patientsResponse.status}`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        {loading && (
          <div className="text-center py-8">
            <p>Testing API endpoints...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Doctors API Test</h2>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Doctors API is working! Found {doctors.length} doctors.
              </div>
              <div className="mt-2 text-sm text-gray-600">
                First doctor: {doctors[0]?.name || 'None'}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Patients API Test</h2>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Patients API is working! Found {patients.length} patients.
              </div>
              <div className="mt-2 text-sm text-gray-600">
                First patient: {patients[0]?.name || 'None'}
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={testAPI}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Test Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
