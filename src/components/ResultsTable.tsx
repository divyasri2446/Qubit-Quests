import React from 'react';
import { Badge } from './ui/Badge';

interface ResultsTableProps {
  results: any;
  config: any;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, config }) => {
  if (!results) {
    return (
      <div className="text-center text-slate-500 py-8">
        No results available. Run VQE calculation to see results.
      </div>
    );
  }

  // Calculate reference energies (simulated)
  const hfEnergy = config.molecule === 'H2' ? -1.1167 : -7.8634;
  const exactEnergy = config.molecule === 'H2' ? -1.1373 : -7.8811;

  return (
    <div className="space-y-6">
      {/* Energy Results */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-900">Energy Comparison</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div>
              <div className="font-semibold text-blue-900">VQE Energy</div>
              <div className="text-sm text-blue-700 font-medium">Variational result</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-blue-900 text-lg">
                {results.energy.toFixed(6)} Ha
              </div>
              <Badge className="bg-blue-200 text-blue-800 font-semibold">
                {(results.energy * 27.2114).toFixed(2)} eV
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
            <div>
              <div className="font-semibold text-green-900">Exact Energy</div>
              <div className="text-sm text-green-700 font-medium">Full CI reference</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-green-900 text-lg">
                {exactEnergy.toFixed(6)} Ha
              </div>
              <Badge className="bg-green-200 text-green-800 font-semibold">
                {(exactEnergy * 27.2114).toFixed(2)} eV
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div>
              <div className="font-semibold text-purple-900">Hartree-Fock Energy</div>
              <div className="text-sm text-purple-700 font-medium">Mean-field reference</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-purple-900 text-lg">
                {hfEnergy.toFixed(6)} Ha
              </div>
              <Badge className="bg-purple-200 text-purple-800 font-semibold">
                {(hfEnergy * 27.2114).toFixed(2)} eV
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Error Analysis */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-900">Error Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-slate-200 rounded-lg">
            <div className="text-sm text-slate-600">VQE vs Exact</div>
            <div className="font-mono text-lg font-bold text-red-600">
              {((results.energy - exactEnergy) * 1000).toFixed(3)} mHa
            </div>
          </div>
          <div className="p-3 border border-slate-200 rounded-lg">
            <div className="text-sm text-slate-600">VQE vs HF</div>
            <div className="font-mono text-lg font-bold text-orange-600">
              {((results.energy - hfEnergy) * 1000).toFixed(3)} mHa
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-900">System Configuration</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Molecule:</span>
              <span className="font-mono">{config.molecule}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Bond Length:</span>
              <span className="font-mono">{config.bondLength} Å</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Basis Set:</span>
              <span className="font-mono">{config.basis}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Ansatz:</span>
              <span className="font-mono">{config.ansatz}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Optimizer:</span>
              <span className="font-mono">{config.optimizer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Backend:</span>
              <span className="font-mono">{config.backend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Convergence Summary */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-900">Convergence Summary</h3>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {results.convergence.length}
              </div>
              <div className="text-sm text-slate-600">Total Iterations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {results.diagnostics.evaluations}
              </div>
              <div className="text-sm text-slate-600">Function Calls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {results.diagnostics.error < 1.6 ? '✓' : '○'}
              </div>
              <div className="text-sm text-slate-600">Chem. Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;