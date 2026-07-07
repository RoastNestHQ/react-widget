import React from 'react';
import './styles.css';
import { useReferralLifecycle } from '../../hooks/useReferralLifecycle';

export const ReferralLifecycle: React.FC = () => {
  const { stages, isRunning, isComplete, runSimulation, reset, goToStage } = useReferralLifecycle();

  return (
    <div className="rrn-lifecycle-container">
      <div className="rrn-lifecycle-header">
        <h3 className="rrn-lifecycle-title">Referral Lifecycle Simulation</h3>
        <div className="rrn-lifecycle-actions">
          <button 
            className="rrn-lifecycle-btn rrn-lifecycle-btn-secondary" 
            onClick={reset}
            disabled={isRunning}
          >
            Reset
          </button>
          <button 
            className="rrn-lifecycle-btn rrn-lifecycle-btn-primary" 
            onClick={runSimulation}
            disabled={isRunning || isComplete}
          >
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="rrn-stages-list">
        {stages.map((stage, index) => (
          <div 
            key={stage.id} 
            className={`rrn-stage-item rrn-stage-${stage.status}`}
            onClick={() => !isRunning && goToStage(index)}
            style={{ cursor: !isRunning ? 'pointer' : 'default' }}
          >
            <div className="rrn-stage-connector" />
            <div className="rrn-stage-indicator" />
            
            <div className="rrn-stage-content">
              <h4 className="rrn-stage-title">Stage {stage.id}: {stage.title}</h4>
              <p className="rrn-stage-desc">{stage.description}</p>
              
              {/* Stages 1-5 have snippet/code payload */}
              {stage.payload && stage.id < 6 && (
                <pre className="rrn-stage-snippet">
                  {stage.payload.snippet 
                    ? stage.payload.snippet as string
                    : JSON.stringify(stage.payload, null, 2)}
                </pre>
              )}

              {/* Stage 6 special rendering */}
              {stage.id === 6 && (
                <div className="rrn-split-cards">
                  <div className="rrn-subcard">
                    <h4>Roastnest Cloud</h4>
                    <p>Validate / Fraud check / Auto reward</p>
                  </div>
                  <div className="rrn-subcard">
                    <h4>Self-hosted</h4>
                    <p>Validate / Custom logic / Own database</p>
                  </div>
                </div>
              )}

              {/* Stage 7 special rendering */}
              {stage.id === 7 && (
                <>
                  <div className="rrn-split-cards">
                    <div className="rrn-subcard">
                      <h4>Referrer</h4>
                      <p>AYUSH123 (+₹500)</p>
                    </div>
                    <div className="rrn-subcard">
                      <h4>Referee</h4>
                      <p>New User (+₹500)</p>
                    </div>
                  </div>
                  {stage.status === 'complete' && (
                    <div className="rrn-success-banner">
                      Referral Complete! AYUSH123 earned ₹500
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
