const BASE_URL = "http://localhost:3001";

// Helper to handle multiple endpoint names (users/usuarios)
const multiFetch = async (endpoint, options = {}) => {
  let response = await fetch(`${BASE_URL}/users${endpoint}`, options);
  if (response.status === 404) {
    response = await fetch(`${BASE_URL}/usuarios${endpoint}`, options);
  }
  return response;
};

export const registerUser = async (userData) => {
  try {
    const response = await multiFetch("", {
      method: "POST",
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
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await multiFetch("");
    
    if (!response.ok) {
      throw new Error(`Error del servidor (${response.status}). Asegúrate de que npm run backend esté activo.`);
    }

    const users = await response.json();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      throw new Error("Credenciales inválidas. Revisa tu correo y contraseña.");
    }

    return user;
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
    return await response.json();
  } catch (error) {
    console.error("Error fetching all users:", error);
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
