"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function StatusPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const newResults: TestResult[] = [];

    // Test 1: Doctors API
    newResults.push({ name: "Doctors API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const data = await response.json();
        newResults[0] = { 
          name: "Doctors API", 
          status: 'success', 
          message: `✅ Found ${data.length} doctors`,
          data: data.slice(0, 2) // Show first 2 doctors
        };
      } else {
        newResults[0] = { 
          name: "Doctors API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[0] = { 
        name: "Doctors API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    // Test 2: Single Doctor API
    newResults.push({ name: "Single Doctor API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/doctors/1');
      if (response.ok) {
        const data = await response.json();
        newResults[1] = { 
          name: "Single Doctor API", 
          status: 'success', 
          message: `✅ Found doctor: ${data.name}`,
          data: data
        };
      } else {
        newResults[1] = { 
          name: "Single Doctor API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[1] = { 
        name: "Single Doctor API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    // Test 3: Patients API
    newResults.push({ name: "Patients API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        newResults[2] = { 
          name: "Patients API", 
          status: 'success', 
          message: `✅ Found ${data.length} patients`,
          data: data.slice(0, 2) // Show first 2 patients
        };
      } else {
        newResults[2] = { 
          name: "Patients API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[2] = { 
        name: "Patients API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    // Test 4: Appointments API
    newResults.push({ name: "Appointments API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        newResults[3] = { 
          name: "Appointments API", 
          status: 'success', 
          message: `✅ Found ${data.length} appointments`,
          data: data.slice(0, 2) // Show first 2 appointments
        };
      } else {
        newResults[3] = { 
          name: "Appointments API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[3] = { 
        name: "Appointments API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    // Test 5: Prescriptions API
    newResults.push({ name: "Prescriptions API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        newResults[4] = { 
          name: "Prescriptions API", 
          status: 'success', 
          message: `✅ Found ${data.length} prescriptions`,
          data: data.slice(0, 2) // Show first 2 prescriptions
        };
      } else {
        newResults[4] = { 
          name: "Prescriptions API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[4] = { 
        name: "Prescriptions API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    // Test 6: Medical History API
    newResults.push({ name: "Medical History API", status: 'loading', message: 'Testing...' });
    setResults([...newResults]);
    
    try {
      const response = await fetch('/api/medical-history');
      if (response.ok) {
        const data = await response.json();
        newResults[5] = { 
          name: "Medical History API", 
          status: 'success', 
          message: `✅ Found ${data.length} medical records`,
          data: data.slice(0, 2) // Show first 2 records
        };
      } else {
        newResults[5] = { 
          name: "Medical History API", 
          status: 'error', 
          message: `❌ HTTP ${response.status}` 
        };
      }
    } catch (error) {
      newResults[5] = { 
        name: "Medical History API", 
        status: 'error', 
        message: `❌ ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...newResults]);

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'loading':
        return <Badge className="bg-blue-100 text-blue-800">Loading</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Schedula System Status</h1>
          <p className="text-muted-foreground">Comprehensive API and functionality test</p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests Again'
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">View Data</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All tests completed. Check the results above to verify system functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
