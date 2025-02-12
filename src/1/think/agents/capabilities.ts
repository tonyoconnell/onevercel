import { I, Interact, type Node } from '../../build/contracts/ontology';

/**
 * ONE Capabilities
 * Core abilities and actions
 */

// Capability types
const Can = {
  CODE: 'code',     // Generate and transform code
  LEARN: 'learn',   // Acquire new knowledge
  TEACH: 'teach',   // Share knowledge
  BUILD: 'build'    // Create new things
} as const;

// Capability definition
interface Capability {
  type: keyof typeof Can;
  i: keyof typeof I;
  interact: keyof typeof Interact;
  handler: (context: unknown) => Promise<Node[]>;
}

// Core capabilities
const Capabilities = new Map<string, Capability>([
  ['generate', {
    type: Can.CODE,
    i: I.BUILD,
    interact: Interact.MAKE,
    handler: async (context) => {
      // Implementation
      return [];
    }
  }],
  ['explain', {
    type: Can.TEACH,
    i: I.THINK,
    interact: Interact.TELL,
    handler: async (context) => {
      // Implementation
      return [];
    }
  }]
]);

export {
  Can,
  type Capability,
  Capabilities
}; 