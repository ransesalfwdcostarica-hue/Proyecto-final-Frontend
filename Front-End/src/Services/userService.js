import { API_BASE_URL } from './apiConfig';
const BASE_URL = API_BASE_URL;

// Helper to handle endpoint names (usuarios is the one in db.json)
const multiFetch = async (endpoint, options = {}) => {
  return await fetch(`${BASE_URL}/usuarios${endpoint}`, options);
};

export const registerUser = async (userData) => {
  try {
    const mappedData = {
      email: userData.email,
      password: userData.password,
      nombre: userData.nombre,
      edad: userData.edad || null,
      rol: userData.rol || 'client',
      followers: [],
      following: [],
      avatar: userData.avatar || '',
      cover: userData.cover || '',
      sexo: userData.sexo || '',
      altura: userData.altura || '',
      peso: userData.peso || '',
      lugarEntrenamiento: userData.lugarEntrenamiento || '',
      alergias: userData.alergias || '',
      pesoMeta: userData.pesoMeta || 0,
      plazoSemanas: userData.plazoSemanas || 8,
      pesoActual: userData.pesoActual || userData.peso || '',
      deficitEstimado: userData.deficitEstimado || 450,
      semanasEnProgreso: 1,
      ejerciciosElegidos: []
    };
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mappedData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
    const savedUser = await response.json();
    return mapUser(savedUser);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: email, contrasenia: password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Credenciales inválidas. Revisa tu correo y contraseña.");
      }
      throw new Error(`Error del servidor (${response.status}). Asegúrate de que el backend esté activo.`);
    }

    const user = await response.json();
    return {
      id: user.idUsuario,
      email: user.correo,
      nombre: user.nombre,
      rol: user.Rol ? user.Rol.nombre : (user.Rol_idRol === 1 ? 'admin' : 'client'),
      ...user,
      ...(user.DatosUsuario || {}),
      pesoActual: user.DatosUsuario?.peso,
      deficitEstimado: user.DatosUsuario?.decifitEstimado,
      semanasEnProgreso: user.DatosUsuario?.semanas_En_Progreso || 1,
      ultimoFeedbackDieta: user.DatosUsuario?.ultimo_Feedback_Dieta,
      ultimoFeedbackEjercicio: user.DatosUsuario?.ultimo_Feedback_Ejercicio,
      ...(user.Perfil || {}),
      avatar: user.Perfil?.foto_Perfil || user.avatar || '',
      cover: user.Perfil?.foto_Portada || user.cover || '',
      following: user.Perfil?.Following?.map(p => p.Usuario_idUsuario) || [],
      followers: user.Perfil?.Followers?.map(p => p.Usuario_idUsuario) || [],
      ejerciciosElegidos: user.DatosUsuario?.Rutinas?.[0]?.Ejercicios?.map(e => e.idEjercicios) || []
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await multiFetch("");
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const usersRaw = await response.json();
    return usersRaw.map(user => ({
      id: user.idUsuario,
      email: user.correo,
      nombre: user.nombre,
      rol: user.Rol_idRol === 1 ? 'admin' : 'client',
      ...user
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getPaginatedUsers = async (page = 1, limit = 10) => {
  try {
    const response = await multiFetch(`?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Error fetching paginated users");
    }
    const data = await response.json();
    return {
      ...data,
      data: data.data.map(user => ({
        id: user.idUsuario,
        email: user.correo,
        nombre: user.nombre,
        rol: user.Rol_idRol === 1 ? 'admin' : 'client',
        ...user
      }))
    };
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await multiFetch(`/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error deleting user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const checkUserExists = async (email) => {
  try {
    // Optimization: Use server-side filtering
    const response = await fetch(`${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const users = await response.json();
    return users.length > 0;
  } catch (error) {
    console.error("Check user error:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await multiFetch(`/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export const saveContactMessage = async (messageData) => {
  try {
    const response = await fetch(`${BASE_URL}/mensajes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Contact form error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await multiFetch(`/${userId}`);
    if (!response.ok) {
      throw new Error("Error fetching user");
    }
    const user = await response.json();
    return {
      id: user.idUsuario,
      email: user.correo,
      nombre: user.nombre,
      rol: user.Rol ? user.Rol.nombre : (user.Rol_idRol === 1 ? 'admin' : 'client'),
      ...user,
      ...(user.DatosUsuario || {}),
      pesoActual: user.DatosUsuario?.peso,
      deficitEstimado: user.DatosUsuario?.decifitEstimado,
      semanasEnProgreso: user.DatosUsuario?.semanas_En_Progreso || 1,
      ultimoFeedbackDieta: user.DatosUsuario?.ultimo_Feedback_Dieta,
      ultimoFeedbackEjercicio: user.DatosUsuario?.ultimo_Feedback_Ejercicio,
      ...(user.Perfil || {}),
      avatar: user.Perfil?.foto_Perfil || user.avatar || '',
      cover: user.Perfil?.foto_Portada || user.cover || '',
      following: user.Perfil?.Following?.map(p => p.Usuario_idUsuario) || [],
      followers: user.Perfil?.Followers?.map(p => p.Usuario_idUsuario) || [],
      ejerciciosElegidos: user.DatosUsuario?.Rutinas?.[0]?.Ejercicios?.map(e => e.idEjercicios) || []
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const getAllContactMessages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/mensajes`);
    if (!response.ok) {
      throw new Error("Error fetching contact messages");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
};

export const deleteContactMessage = async (messageId) => {
  try {
    const response = await fetch(`${BASE_URL}/mensajes/${messageId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error deleting contact message");
    }
  } catch (error) {
    console.error("Error deleting contact message:", error);
    throw error;
  }
};
export const actualizarImg = async (userId, imageUrl) => {
  try {
    if (!imageUrl || imageUrl.startsWith("data:")) {
      throw new Error("La imagen no es una URL válida");
    }

    const response = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error actualizando imagen:", error);
    throw error;
  }
};
