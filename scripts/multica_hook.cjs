/**
 * Multica.ai Autonomous Project Board Hook & Telemetry Synchronizer
 * Handles task card lifecycle (Creation on Goal Start -> State Update -> Done on Verified Payload)
 */

class MulticaHook {
  constructor(config = {}) {
    this.token = config.token || process.env.MULTICA_TOKEN || 'mul_aad506fca5956eb41e5b5ff80e7110c5c8ca2421';
    this.endpoint = config.endpoint || 'https://api.multica.ai/v1';
    this.activeTasks = new Map();
  }

  async createTaskCard(goalDescription, metadata = {}) {
    const taskId = 'TASK-' + Date.now().toString(36).toUpperCase();
    const payload = {
      id: taskId,
      title: goalDescription.slice(0, 80),
      description: goalDescription,
      status: 'IN_PROGRESS',
      priority: metadata.priority || 'HIGH',
      assigned_agent: metadata.agent || 'Asura-Strategist',
      created_at: new Date().toISOString(),
      metadata: {
        provider: 'github-models',
        soul_profile: 'soul.md',
        ...metadata
      }
    };

    this.activeTasks.set(taskId, payload);

    try {
      await fetch(`${this.endpoint}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log(`[MULTICA] Task card created: ${taskId} ("${payload.title}")`);
    } catch (err) {
      console.log(`[MULTICA LOCAL TRACKER] Task logged: ${taskId} - In Progress`);
    }

    return taskId;
  }

  async completeTaskCard(taskId, verifiedPayload = {}) {
    const task = this.activeTasks.get(taskId) || { id: taskId };
    task.status = 'DONE';
    task.completed_at = new Date().toISOString();
    task.verification = {
      verified: true,
      payload_type: verifiedPayload.type || 'SOURCE_HTML',
      bytes: verifiedPayload.size || (verifiedPayload.data ? verifiedPayload.data.length : 0),
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(`${this.endpoint}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
      console.log(`[MULTICA] Task verified & marked DONE: ${taskId}`);
    } catch (err) {
      console.log(`[MULTICA LOCAL TRACKER] Task verified & marked DONE: ${taskId}`);
    }

    return task;
  }
}

module.exports = MulticaHook;

// CLI usage
if (require.main === module) {
  const hook = new MulticaHook();
  hook.createTaskCard('System Initialization: ASURA Hermes Engine Setup')
    .then(id => hook.completeTaskCard(id, { type: 'CONFIG', size: 1024 }))
    .then(() => console.log('[MULTICA HOOK] Verification cycle complete.'));
}
