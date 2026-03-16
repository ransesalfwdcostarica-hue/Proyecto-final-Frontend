const BASE_URL = "http://localhost:3001";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios`, {
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
    const response = await fetch(`${BASE_URL}/usuarios`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
