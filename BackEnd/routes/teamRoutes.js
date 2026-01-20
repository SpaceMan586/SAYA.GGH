const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// @route   GET api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await Team.find().sort({ created_at: -1 });
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/team
// @desc    Add a new team member
// @access  Private
router.post('/', async (req, res) => {
  const { name, role, image_url } = req.body;

  try {
    const newTeamMember = new Team({
      name,
      role,
      image_url,
    });

    const teamMember = await newTeamMember.save();
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/team/:id
// @desc    Delete a team member
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let teamMember = await Team.findById(req.params.id);

    if (!teamMember) return res.status(404).json({ msg: 'Team member not found' });

    await Team.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Team member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
