const battleInstances = new Map();

// Save a battle instance
function setBattle(id, battle) {
  battleInstances.set(id, battle);
}

// Get a battle instance
function getBattle(id) {
  return battleInstances.get(id);
}

// Remove a battle instance when it's over
function removeBattle(id) {
  battleInstances.delete(id);
}

module.exports = { setBattle, getBattle, removeBattle };