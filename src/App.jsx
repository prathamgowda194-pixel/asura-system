import React, { useState } from 'react';
import AsuraDashboard from './components/AsuraDashboard';

export default function App() {
  const handleTriggerPipeline = async (agentName) => {
    console.log(`[ASURA ORCHESTRATION] Triggering pipeline execution for: ${agentName}`);
    try {
      const res = await fetch('/api/run-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: agentName }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log('[ASURA ORCHESTRATION] Pipeline triggered successfully:', data);
      }
    } catch (e) {
      console.info('[ASURA ORCHESTRATION] Backend bridge offline or in autonomous loop mode; pipeline trigger acknowledged in UI.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#060913]">
      <AsuraDashboard onTriggerPipeline={handleTriggerPipeline} />
    </div>
  );
}
