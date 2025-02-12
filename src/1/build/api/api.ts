import { Router } from 'express';
import { I1Value__factory } from '../typechain-types';
import { ethers } from 'ethers';
import { Monitor } from '../monitor';

const router = Router();
const monitor = new Monitor();

// Get value exchange stats
router.get('/stats', async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = I1Value__factory.connect(
      process.env.I1_VALUE_ADDRESS!,
      provider
    );

    const stats = await contract.getStats();
    res.json(stats);
  } catch (error) {
    await monitor.error('Failed to get stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router; 