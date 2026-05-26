import { API_BASE_URL } from './apiConfig';
const BASE_URL = `${API_BASE_URL}/api`;

//Obtener todos los ejercicios
export const obtenerTodosEjercicios = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ejercicios`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(ex => ({
      id: ex.id_ejercicio || ex.idEjercicios || ex.id,
      ...ex
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const getPaginatedExercises = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/ejercicios?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      ...data,
      data: data.data.map(ex => ({
        id: ex.id_ejercicio || ex.idEjercicios || ex.id,
        ...ex
      }))
    };
  } catch (error) {
    console.error("Error fetching paginated exercises:", error);
    throw error;
  }
};

//Obtener ejercicios por categoría
export const obtenerEjerciciosPorCategoria = async (category) => {
  try {
    const response = await fetch(`${BASE_URL}/ejercicios?categoria=${category}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching exercises for category ${category}:`, error);
    throw error;
  }
};

//Crear un ejercicio
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Crear un ejercicio
export const crearEjercicio = async (exerciseData) => {
  try {
    // Ensure required optional fields have defaults to satisfy DB constraints
    const payload = {
      ...exerciseData,
      video: exerciseData.video || '',
      imagen: exerciseData.imagen || '',
      tiempo: exerciseData.tiempo || '',
    };
    const response = await fetch(`${BASE_URL}/ejercicios`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }
};

// Actualizar un ejercicio
export const actualizarEjercicio = async (id, exerciseData) => {
  try {
    const response = await fetch(`${BASE_URL}/ejercicios/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating exercise ${id}:`, error);
    throw error;
  }
};

// Eliminar un ejercicio
export const eliminarEjercicio = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/ejercicios/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting exercise ${id}:`, error);
    throw error;
  }
};
