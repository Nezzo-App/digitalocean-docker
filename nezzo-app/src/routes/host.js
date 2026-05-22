import express from 'express';

const router = express.Router();

// Mock hosting services
const hostedSites = new Map();

// Deploy site
router.post('/deploy', (req, res) => {
  const { name, content, domain } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' });
  }

  const siteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generatedDomain = domain || `${name.toLowerCase().replace(/\s+/g, '-')}.nezzo.host`;

  hostedSites.set(siteId, {
    id: siteId,
    name: name,
    content: content,
    domain: generatedDomain,
    status: 'active',
    deployedAt: new Date().toISOString(),
    visits: 0
  });

  res.json({
    success: true,
    siteId: siteId,
    domain: generatedDomain,
    message: 'Site deployed on Nezzo Host'
  });
});

// Get site
router.get('/site/:siteId', (req, res) => {
  const { siteId } = req.params;
  const site = hostedSites.get(siteId);

  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }

  site.visits += 1;

  res.json({
    success: true,
    site: site
  });
});

// List all sites
router.get('/sites', (req, res) => {
  const sites = Array.from(hostedSites.values()).map(site => ({
    id: site.id,
    name: site.name,
    domain: site.domain,
    status: site.status,
    deployedAt: site.deployedAt,
    visits: site.visits
  }));

  res.json({
    success: true,
    sites: sites,
    total: sites.length
  });
});

// Update site
router.put('/site/:siteId', (req, res) => {
  const { siteId } = req.params;
  const { content, name } = req.body;

  const site = hostedSites.get(siteId);

  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }

  if (content) site.content = content;
  if (name) site.name = name;
  site.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Site updated on Nezzo Host'
  });
});

// Delete site
router.delete('/site/:siteId', (req, res) => {
  const { siteId } = req.params;

  if (!hostedSites.has(siteId)) {
    return res.status(404).json({ error: 'Site not found' });
  }

  hostedSites.delete(siteId);

  res.json({
    success: true,
    message: 'Site removed from Nezzo Host'
  });
});

// Get hosting stats
router.get('/stats', (req, res) => {
  const sites = Array.from(hostedSites.values());
  const totalVisits = sites.reduce((sum, site) => sum + site.visits, 0);

  res.json({
    success: true,
    stats: {
      totalSites: sites.length,
      totalVisits: totalVisits,
      activeSites: sites.filter(s => s.status === 'active').length
    }
  });
});

export default router;
