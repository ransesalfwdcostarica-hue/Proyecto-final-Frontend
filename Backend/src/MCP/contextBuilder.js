const getUserProfile = require('./tools/getUserProfile');
const getUserMetrics = require('./tools/getUserMetrics');
const getUserAllergies = require('./tools/getUserAllergies');
const getUserRoutine = require('./tools/getUserRoutine');
const getUserProgress = require('./tools/getUserProgress');


const buildUserContext = async (userId) => {

    const [
        profile,
        metrics,
        allergies,
        routine,
        progress
    ] = await Promise.all([
        getUserProfile(userId),
        getUserMetrics(userId),
        getUserAllergies(userId),
        getUserRoutine(userId),
        getUserProgress(userId)
    ]);

    return {
        profile,
        metrics,
        allergies,
        routine,
        progress
    };
};



module.exports = buildUserContext;