const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const statsPath = path.join(__dirname, 'public', 'json', 'stats.json');
const siteStatsPath = path.join(__dirname, 'public', 'json', 'siteStats.json');
const publicPath = path.join(__dirname, 'public');

let stats = {};
let siteStats = { views: 0 };

// Load stats from file
const loadStats = () => {
  if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath));
  }
};
const saveStats = () => {
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
};

// Load site stats from file
const loadSiteStats = () => {
  if (fs.existsSync(siteStatsPath)) {
    siteStats = JSON.parse(fs.readFileSync(siteStatsPath));
  }
};
const saveSiteStats = () => {
  fs.writeFileSync(siteStatsPath, JSON.stringify(siteStats, null, 2));
};

loadStats();
loadSiteStats();

app.use(express.static(publicPath));
app.use(express.json());

app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api') &&
    !req.path.startsWith('/json') &&
    !req.path.startsWith('/images') &&
    !req.path.startsWith('/javascript') &&
    !req.path.startsWith('/css')
  ) {
    siteStats.views++;
    saveSiteStats();
    console.log('Site view incremented:', siteStats.views);
  }
  next();
});

// Endpoint to get total site views
app.get('/api/site-views', (req, res) => {
  res.json({ views: siteStats.views });
});

// Get all stats
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// Get stats for a specific game
app.get('/api/stats/:gameId', (req, res) => {
  const { gameId } = req.params;
  stats[gameId] ||= { views: 0, likes: 0, dislikes: 0 };
  res.json(stats[gameId]);
});

// Increment view count
app.post('/api/view/:gameId', (req, res) => {
  const { gameId } = req.params;
  stats[gameId] ||= { views: 0, likes: 0, dislikes: 0 };
  stats[gameId].views++;
  saveStats();
  res.json({ success: true });
});

// Like a game (or undo like)
app.post('/api/like/:gameId', (req, res) => {
  const { gameId } = req.params;
  const undo = req.body && req.body.undo;
  stats[gameId] ||= { views: 0, likes: 0, dislikes: 0 };
  if (undo) {
    stats[gameId].likes = Math.max(0, stats[gameId].likes - 1);
  } else {
    stats[gameId].likes++;
  }
  saveStats();
  res.json({ success: true });
});

// Dislike a game (or undo dislike)
app.post('/api/dislike/:gameId', (req, res) => {
  const { gameId } = req.params;
  const undo = req.body && req.body.undo;
  stats[gameId] ||= { views: 0, likes: 0, dislikes: 0 };
  if (undo) {
    stats[gameId].dislikes = Math.max(0, stats[gameId].dislikes - 1);
  } else {
    stats[gameId].dislikes++;
  }
  saveStats();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
