import { useStore } from '@nanostores/react'
import { memoryStore } from './memory'
import { MemoryManager } from './manager'
import type { Memory, MemoryContent } from './memory'
import { useState, useCallback } from 'react'

const manager = new MemoryManager()

interface MemoryOperation {
  loading: boolean
  error: Error | null
}

export function useMemory() {
  const memories = useStore(memoryStore)
  const [operations, setOperations] = useState<Record<string, MemoryOperation>>({})

  const updateOperation = useCallback((operation: string, state: Partial<MemoryOperation>) => {
    setOperations(prev => ({
      ...prev,
      [operation]: { ...prev[operation], ...state }
    }))
  }, [])

  const store = async (memory: Omit<Memory, 'id'>) => {
    updateOperation('store', { loading: true, error: null })
    try {
      const id = crypto.randomUUID()
      const success = await manager.store({ ...memory, id })
      updateOperation('store', { loading: false })
      return success
    } catch (error) {
      updateOperation('store', { loading: false, error: error as Error })
      return false
    }
  }

  const recall = async (query: string, limit?: number) => {
    updateOperation('recall', { loading: true, error: null })
    try {
      const results = await manager.recall(query, limit)
      updateOperation('recall', { loading: false })
      return results
    } catch (error) {
      updateOperation('recall', { loading: false, error: error as Error })
      return []
    }
  }

  const forget = async (id: string) => {
    updateOperation('forget', { loading: true, error: null })
    try {
      const success = await manager.forget(id)
      updateOperation('forget', { loading: false })
      return success
    } catch (error) {
      updateOperation('forget', { loading: false, error: error as Error })
      return false
    }
  }

  const connect = async (memoryId: string, relatedId: string) => {
    updateOperation('connect', { loading: true, error: null })
    try {
      const success = await manager.connect(memoryId, relatedId)
      updateOperation('connect', { loading: false })
      return success
    } catch (error) {
      updateOperation('connect', { loading: false, error: error as Error })
      return false
    }
  }

  return {
    memories,
    operations,
    store,
    recall,
    forget,
    connect
  }
} 