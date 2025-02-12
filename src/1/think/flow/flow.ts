import { z } from 'zod'
import { ThinkTypes } from '../types/types'
import { OntologyManager } from '../ontology/ontology'

// Workflow Schema
export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['analysis', 'generation', 'transformation']),
  steps: z.array(z.object({
    id: z.string().uuid(),
    type: z.string(),
    action: z.string(),
    dependencies: z.array(z.string().uuid()),
    metadata: z.object({
      timeout: z.number(),
      retries: z.number()
    })
  })),
  state: z.object({
    status: z.enum(['pending', 'running', 'completed', 'failed']),
    currentStep: z.string().uuid().optional(),
    results: z.record(z.unknown())
  })
})

export class WorkflowManager {
  private ontology: OntologyManager

  constructor() {
    this.ontology = new OntologyManager()
  }

  async executeWorkflow(workflow: z.infer<typeof WorkflowSchema>) {
    // Initialize workflow
    workflow.state.status = 'running'
    
    try {
      // Execute steps in dependency order
      const sortedSteps = this.sortByDependencies(workflow.steps)
      
      for (const step of sortedSteps) {
        workflow.state.currentStep = step.id
        
        // Apply ontology rules before execution
        await this.ontology.applyRules({
          workflow,
          step,
          context: workflow.state.results
        })
        
        // Execute step with retries
        const result = await this.executeStepWithRetries(step)
        
        // Store result
        workflow.state.results[step.id] = result
      }
      
      workflow.state.status = 'completed'
      return workflow
      
    } catch (error) {
      workflow.state.status = 'failed'
      throw error
    }
  }

  private async executeStepWithRetries(step: WorkflowSchema['steps'][0]) {
    let attempts = 0
    
    while (attempts < step.metadata.retries) {
      try {
        return await this.executeStep(step)
      } catch (error) {
        attempts++
        if (attempts === step.metadata.retries) throw error
        await new Promise(r => setTimeout(r, 1000 * attempts))
      }
    }
  }
} 