import { API_BASE_URL } from './apiConfig';
const BASE_URL = API_BASE_URL;

// Helper to handle endpoint names (usuarios is the one in db.json)
const multiFetch = async (endpoint, options = {}) => {
  return await fetch(`${BASE_URL}/usuarios${endpoint}`, options);
};

export const registerUser = async (userData) => {
  try {
    const mappedData = {
      ...userData,
      email: userData.email,
      password: userData.password,
      nombre: userData.nombre,
      rol: userData.rol || 'client',
      followers: [],
      following: [],
      avatar: '',
      cover: ''
    };
    const response = await fetch(`${BASE_URL}/usuarios`, {
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
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Para json-server, los filtros son case-sensitive.
    // Para evitar problemas, traemos los usuarios y filtramos en JS.
    const response = await fetch(`${BASE_URL}/usuarios`);

    if (!response.ok) {
      throw new Error(`Error del servidor (${response.status}). Asegúrate de que el backend esté activo.`);
    }

    const allUsers = await response.json();
    
    // Buscamos ignorando mayúsculas/minúsculas en el email
    const user = allUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!user) {
      throw new Error("Credenciales inválidas. Revisa tu correo y contraseña.");
    }
    
    // Mapeo para mantener compatibilidad con el resto de la app
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol || (user.rol === 'admin' ? 'admin' : 'client'),
      ...user,
      pesoActual: user.peso,
      semanasEnProgreso: user.semanasEnProgreso || 1,
      ultimoFeedbackDieta: user.ultimoFeedbackDieta,
      ultimoFeedbackEjercicio: user.ultimoFeedbackEjercicio,
      avatar: user.avatar || '',
      cover: user.cover || '',
      following: user.following || [],
      followers: user.followers || [],
      ejerciciosElegidos: user.ejerciciosElegidos || []
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
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol === 'admin' ? 'admin' : 'client',
      ...user
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getPaginatedUsers = async (page = 1, limit = 10) => {
  try {
    // json-server por defecto devuelve un array
    const response = await multiFetch(`?_page=${page}&_limit=${limit}`);
    if (!response.ok) {
      throw new Error("Error fetching paginated users");
    }
    const data = await response.json();
    
    // Si json-server devuelve un objeto con 'data' (v1+) o solo un array (v0.x)
    const usersArray = Array.isArray(data) ? data : (data.data || []);
    
    return {
      data: usersArray.map(user => ({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol || (user.rol === 'admin' ? 'admin' : 'client'),
        ...user
      })),
      total: parseInt(response.headers.get('X-Total-Count') || usersArray.length)
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
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol || (user.rol === 'admin' ? 'admin' : 'client'),
      ...user,
      pesoActual: user.peso,
      semanasEnProgreso: user.semanasEnProgreso || 1,
      ultimoFeedbackDieta: user.ultimoFeedbackDieta,
      ultimoFeedbackEjercicio: user.ultimoFeedbackEjercicio,
      avatar: user.avatar || '',
      cover: user.cover || '',
      following: user.following || [],
      followers: user.followers || [],
      ejerciciosElegidos: user.ejerciciosElegidos || []
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
