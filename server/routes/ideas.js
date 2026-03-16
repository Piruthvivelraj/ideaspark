const express = require('express');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');
const Idea = require('../models/Idea');
const SeenIdea = require('../models/SeenIdea');
const ideasData = require('../data/ideas');

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate all ideas via Groq AI
async function generateAIIdeas(answers, seenTitles) {
  const seenList = seenTitles.size > 0
    ? `\nDo NOT generate any of these already-seen titles:\n${[...seenTitles].join(', ')}`
    : '';

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert project idea generator for students. Always respond with a valid JSON array only. No markdown, no explanation, just the raw JSON array.',
      },
      {
        role: 'user',
        content: `Generate exactly 15 unique student project ideas based on these preferences:
- Domain: ${answers.domain}
- Experience Level: ${answers.difficulty}
- Goal: ${answers.goal}
- Team: ${answers.team}
- Timeline: ${answers.timeline}
- Preferred Technology: ${answers.tech}
- Output Type: ${answers.output}${answers.custom ? `\n- Specific requirement: ${answers.custom}` : ''}${seenList}

Return ONLY a JSON array of 15 objects:
[
  {
    "title": "Unique project title",
    "description": "2-3 sentences describing what it does and its real-world impact",
    "techStack": ["Tech1", "Tech2", "Tech3", "Tech4"],
    "difficulty": "Beginner|Intermediate|Advanced",
    "aiGenerated": true
  }
]

Rules:
- All 15 ideas must be completely different from each other
- Titles must be specific and descriptive, not generic
- Match tech stack to preferred technology (${answers.tech}) where possible
- Mix difficulty levels: include Beginner, Intermediate, and Advanced ideas
- Each idea must be practical and buildable by a student${answers.custom ? "\n- Several ideas must directly address the user's specific requirement" : ''}
- Make ideas creative, modern, and relevant to current trends`,
      },
    ],
    temperature: 0.95,
    max_tokens: 4000,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  const cleaned = text.replace(/```json|```/g, '').trim();
  const ideas = JSON.parse(cleaned);
  return Array.isArray(ideas) ? ideas.map(i => ({ ...i, aiGenerated: true })) : [];
}

// Generate ideas — fully AI-powered, dataset as fallback
router.get('/generate', authMiddleware, async (req, res) => {
  const { domain, difficulty, goal, team, timeline, tech, output, custom } = req.query;

  try {
    // Get titles this user has already seen (to avoid repeats)
    const seen = await SeenIdea.find({ userId: req.userId, domain: domain || '' });
    const seenTitles = new Set(seen.map(s => s.title));

    let ideas = [];

    // Try Groq first
    if (process.env.GROQ_API_KEY) {
      try {
        ideas = await generateAIIdeas(
          { domain, difficulty, goal, team, timeline, tech, output, custom },
          seenTitles
        );
      } catch (err) {
        console.error('Groq failed, falling back to dataset:', err.message);
      }
    }

    // Fallback to dataset if Groq failed or no key
    if (ideas.length === 0 && domain && ideasData[domain]) {
      let pool = ideasData[domain];
      if (difficulty && difficulty !== 'Any') {
        pool = pool.filter(i => i.difficulty === difficulty);
      }
      let unseen = pool.filter(i => !seenTitles.has(i.title));
      if (unseen.length === 0) {
        await SeenIdea.deleteMany({ userId: req.userId, domain });
        unseen = pool;
      }
      ideas = unseen;
    }

    // Track seen titles to avoid repeats next session
    if (ideas.length > 0) {
      const toMark = ideas.map(i => ({ userId: req.userId, domain: domain || 'custom', title: i.title }));
      await SeenIdea.insertMany(toMark, { ordered: false }).catch(() => {});
    }

    res.json({ domain, ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save an idea
router.post('/save', authMiddleware, async (req, res) => {
  const { domain, title, description, techStack, difficulty } = req.body;
  try {
    const existing = await Idea.findOne({ userId: req.userId, title });
    if (existing) return res.status(400).json({ message: 'Already saved' });
    const idea = await Idea.create({ userId: req.userId, domain, title, description, techStack, difficulty });
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save idea' });
  }
});

// Get saved ideas
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const ideas = await Idea.find({ userId: req.userId }).sort({ savedAt: -1 });
    res.json(ideas);
  } catch {
    res.status(500).json({ message: 'Failed to fetch' });
  }
});

// Delete saved idea
router.delete('/saved/:id', authMiddleware, async (req, res) => {
  try {
    await Idea.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

// Domains list
router.get('/domains', (req, res) => {
  res.json({ domains: Object.keys(ideasData) });
});

module.exports = router;
