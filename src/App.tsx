import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { Badge } from './components/ui/Badge';
import { Progress } from './components/ui/Progress';
import MolecularSetup from './components/MolecularSetup';
import EnergyPlot from './components/EnergyPlot';
import DiagnosticsDashboard from './components/DiagnosticsDashboard';
import ResultsTable from './components/ResultsTable';
import { Play, Download, Settings, Atom, BarChart3, FileText } from 'lucide-react';

interface VQEResult {
  energy: number;
  convergence: Array<{ iteration: number; energy: number }>;
  diagnostics: {
    qubits: number;
    pauliTerms: number;
    circuitDepth: number;
    evaluations: number;
    totalShots: number;
    error: number;
  };
}

interface MoleculeConfig {
  molecule: 'H2' | 'LiH';
  bondLength: number;
  basis: string;
  ansatz: string;
  optimizer: string;
  backend: string;
  shots: number;
  maxIterations: number;
}

function App() {
  const [config, setConfig] = useState<MoleculeConfig>({
    molecule: 'H2',
    bondLength: 0.74,
    basis: 'STO-3G',
    ansatz: 'UCCSD',
    optimizer: 'COBYLA',
    backend: 'statevector',
    shots: 4000,
    maxIterations: 200
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<VQEResult | null>(null);
  const [dissociationData, setDissociationData] = useState<Array<{ r: number; energy: number }>>([]);

  const runVQE = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate VQE calculation with realistic data
    const convergenceData = [];
    const totalIterations = 50;
    
    for (let i = 0; i <= totalIterations; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simulate energy convergence for H2
      const baseEnergy = config.molecule === 'H2' ? -1.13727 : -7.8773;
      const noise = Math.exp(-i * 0.1) * 0.01 * (Math.random() - 0.5);
      const energy = baseEnergy + noise;
      
      convergenceData.push({ iteration: i, energy });
      setProgress((i / totalIterations) * 100);
      
      if (i % 5 === 0) {
        setResults({
          energy,
          convergence: [...convergenceData],
          diagnostics: {
            qubits: config.molecule === 'H2' ? 2 : 8,
            pauliTerms: config.molecule === 'H2' ? 5 : 24,
            circuitDepth: config.ansatz === 'UCCSD' ? 12 : 6,
            evaluations: i + 1,
            totalShots: config.backend === 'statevector' ? 0 : config.shots * (i + 1),
            error: Math.abs(energy - baseEnergy) * 1000 // milli-Hartree
          }
        });
      }
    }
    
    setIsRunning(false);
  };

  const generateDissociationCurve = async () => {
    setIsRunning(true);
    const curveData = [];
    const bondLengths = Array.from({ length: 15 }, (_, i) => 0.4 + i * 0.15);
    
    for (let i = 0; i < bondLengths.length; i++) {
      const r = bondLengths[i];
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Morse potential approximation for H2
      const D = 0.4556;  // Dissociation energy
      const a = 1.44;    // Width parameter
      const re = 0.74;   // Equilibrium bond length
      
      const energy = -1.13727 + D * Math.pow(1 - Math.exp(-a * (r - re)), 2) - D;
      curveData.push({ r, energy });
      
      setProgress((i / bondLengths.length) * 100);
    }
    
    setDissociationData(curveData);
    setIsRunning(false);
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      configuration: config,
      results: results,
      dissociation: dissociationData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vqe_results_${config.molecule}_${config.bondLength}A.json`;
    a.click();
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b shadow-sm bg-white/90 backdrop-blur-md border-slate-300">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="relative flex items-center justify-between">
            {/* Left: Qubit-Quests Logo */}
            <div className="flex items-center space-x-4">
             <div className="relative">
               <img 
                 src="/Qubit-Quests-logo.png" 
                 alt="Qubit-Quests Logo" 
                 className="object-contain w-12 h-12 rounded-lg"
               />
               <div className="absolute inset-0 rounded-lg ring-2 ring-cyan-400/50 animate-pulse"></div>
             </div>
             <div>
               <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                 QUBIT-QUESTS
               </span>
             </div>
             </div>
            
            {/* Center: Main Title */}
            <div className="absolute text-center transform -translate-x-1/2 left-1/2">
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
                Quantum Chemistry VQE
              </h1>
              <p className="text-sm font-medium text-slate-700">Variational Quantum Eigensolver for Molecular Systems</p>
            </div>
            
            {/* Right: Status and Run Button */}
            <div className="flex items-center space-x-3">
              <Badge 
                variant={isRunning ? "destructive" : "secondary"}
                className={`px-4 py-2 text-sm font-bold ${
                  isRunning 
                    ? 'bg-red-100 text-red-900 border-red-300' 
                    : results 
                      ? 'bg-green-100 text-green-900 border-green-300'
                      : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}
              >
                {isRunning ? "Computing..." : results ? "Complete" : "Ready"}
              </Badge>
              <Button 
                onClick={runVQE} 
                disabled={isRunning}
                className="px-6 font-bold transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run VQE'}
              </Button>
            </div>
          </div>
          
          {isRunning && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-slate-700">
                <span>{isRunning ? 'VQE Optimization Progress' : 'Complete'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-slate-200" />
              {results && (
                <div className="mt-2 text-xs text-slate-600">
                  Current energy: {results.energy.toFixed(6)} Ha
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-md shadow-lg border border-slate-200">
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Setup</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Diagnostics</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Atom className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <MolecularSetup config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Energy Convergence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnergyPlot data={results?.convergence || []} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Results Summary</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportResults}
                      disabled={!results}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResultsTable results={results} config={config} />
                </CardContent>
              </Card>
            </div>

            {dissociationData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dissociation Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnergyPlot 
                    data={dissociationData.map(d => ({ iteration: d.r * 100, energy: d.energy }))} 
                    xLabel="Bond Length (Å)" 
                    isDissociation={true}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <DiagnosticsDashboard results={results} config={config} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateDissociationCurve} 
                    disabled={isRunning}
                    className="w-full"
                  >
                    Generate Dissociation Curve
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Error Analysis</h4>
                    {results && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">VQE Error:</span>
                          <span className="text-sm font-mono">
                            {results.diagnostics.error.toFixed(3)} mHa
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Chemical Accuracy:</span>
                          <span className="text-sm font-mono">
                            {results.diagnostics.error < 1.6 ? "✓ Achieved" : "✗ Not reached"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Computational Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {results && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {results.diagnostics.qubits}
                          </div>
                          <div className="text-sm text-slate-600">Qubits Used</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {results.diagnostics.circuitDepth}
                          </div>
                          <div className="text-sm text-slate-600">Circuit Depth</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Pauli Terms:</span>
                          <span className="text-sm font-mono">{results.diagnostics.pauliTerms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Function Evaluations:</span>
                          <span className="text-sm font-mono">{results.diagnostics.evaluations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Shots:</span>
                          <span className="text-sm font-mono">
                            {results.diagnostics.totalShots.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;