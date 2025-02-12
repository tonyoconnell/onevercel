const SyncEngine = {
  // Watch "1" source files
  watch: ['1.ts', '1.tsx', '1.css', '1.yaml', '1.json'],
  
  // Regenerate on changes
  onChange: async (file) => {
    const affected = getDependents(file)
    await regenerateFiles(affected)
  },
  
  // Maintain perfect sync
  validate: async () => {
    const status = await checkSync()
    if (!status.perfect) {
      await regenerateAll()
    }
  }
} 