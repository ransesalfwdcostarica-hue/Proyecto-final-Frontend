import { MOCK_BASE_URL } from './apiConfig';
const BASE_URL = MOCK_BASE_URL;

export const getAllRoutines = async () => {
  try {
    const response = await fetch(`${BASE_URL}/rutinas`);
    if (!response.ok) {
      throw new Error("Error fetching routines");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching routines:", error);
    throw error;
  }
};

export const updateRoutineStatus = async (routineId, newStatus) => {
  try {
    // First fetch the specific routine
    const getResponse = await fetch(`${BASE_URL}/rutinas/${routineId}`);
    if (!getResponse.ok) {
      throw new Error("Error fetching routine");
    }
    const routine = await getResponse.json();

    // Update the status
    const updatedRoutine = { ...routine, status: newStatus };

    const putResponse = await fetch(`${BASE_URL}/rutinas/${routineId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRoutine),
    });

    if (!putResponse.ok) {
      throw new Error("Error updating routine status");
    }

    return await putResponse.json();
  } catch (error) {
    console.error("Error updating routine status:", error);
    throw error;
  }
};

export const deleteRoutine = async (routineId) => {
  try {
    const response = await fetch(`${BASE_URL}/rutinas/${routineId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error deleting routine");
    }
  } catch (error) {
    console.error("Error deleting routine:", error);
    throw error;
  }
};
