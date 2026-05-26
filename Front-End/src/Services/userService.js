import { API_BASE_URL } from './apiConfig';

const BASE_URL = API_BASE_URL; // http://localhost:3000

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const mapUsuario = (u) => {
  if (!u) return null;
  return {
    id: u.id ?? u.id_usuario ?? u.idUsuario,
    email: u.correo ?? u.email,
    correo: u.correo ?? u.email,
    nombre: u.nombre,
    edad: u.edad,
    id_rol: u.id_rol ?? u.Rol_idRol,
    rol: u.rol ?? u.Rol?.nombre ?? (u.Rol_idRol === 1 ? 'admin' : 'client'),
    avatar: u.avatar ?? u.Perfil?.foto_perfil ?? u.Perfil?.foto_Perfil ?? '',
    cover: u.cover ?? u.Perfil?.foto_portada ?? u.Perfil?.foto_Portada ?? '',
    pesoActual: u.pesoActual ?? u.DatosUsuario?.peso ?? null,
    pesoMeta: u.pesoMeta ?? u.DatosUsuario?.peso_meta ?? null,
    altura: u.altura ?? u.DatosUsuario?.altura ?? null,
    plazoSemanas: u.plazoSemanas ?? u.DatosUsuario?.plazo_semanas ?? null,
    deficitEstimado: u.deficitEstimado ?? u.DatosUsuario?.deficit_estimado ?? u.DatosUsuario?.decifitEstimado ?? null,
    semanasEnProgreso: u.semanasEnProgreso ?? u.DatosUsuario?.semanas_progreso ?? u.DatosUsuario?.semanas_En_Progreso ?? 1,
    ultimoFeedbackDieta: u.ultimoFeedbackDieta ?? u.DatosUsuario?.feedback_dieta ?? u.DatosUsuario?.ultimo_Feedback_Dieta ?? null,
    ultimoFeedbackEjercicio: u.ultimoFeedbackEjercicio ?? u.DatosUsuario?.feedback_ejercicio ?? u.DatosUsuario?.ultimo_Feedback_Ejercicio ?? null,
    sexo: u.sexo ?? u.DatosUsuario?.sexo ?? null,
    lugarEntrenamiento: u.lugarEntrenamiento ?? u.DatosUsuario?.lugar_entrenamiento ?? null,
    alergias: u.alergias ?? (u.DatosUsuario?.Alergia ? u.DatosUsuario.Alergia.map(a => a.nombre).join(', ') : (u.DatosUsuario?.Alergias ? u.DatosUsuario.Alergias.map(a => a.nombre).join(', ') : 'Ninguna')),
    following: u.following ?? u.Perfil?.Following?.map(p => p.id_usuario || p.Usuario_idUsuario) ?? [],
    followers: u.followers ?? u.Perfil?.Followers?.map(p => p.id_usuario || p.Usuario_idUsuario) ?? [],
    ejerciciosElegidos: u.ejerciciosElegidos ?? u.DatosUsuario?.Rutinas?.[0]?.Ejercicios?.map(e => e.id_ejercicio || e.idEjercicios) ?? []
  };
};

export const registerUser = async (userData) => {
  const payload = {
    correo: userData.email || userData.correo,
    contrasenia: userData.password || userData.contrasenia,
    nombre: userData.nombre,
    edad: userData.edad ? Number(userData.edad) : 18,
    sexo: userData.sexo || 'Masculino',
    altura: userData.altura ? Number(userData.altura) : 1.70,
    peso: userData.peso ? Number(userData.peso) : 70.0,
    lugarEntrenamiento: userData.lugarEntrenamiento || 'Casa',
    alergias: userData.alergias || '',
    pesoMeta: userData.pesoMeta ? Number(userData.pesoMeta) : 70.0,
    plazoSemanas: userData.plazoSemanas ? Number(userData.plazoSemanas) : 8,
    deficitEstimado: userData.deficitEstimado ? Number(userData.deficitEstimado) : 450,
    semanasEnProgreso: userData.semanasEnProgreso ? Number(userData.semanasEnProgreso) : 0,
    ultimoFeedbackDieta: userData.ultimoFeedbackDieta || 'Ninguno',
    ultimoFeedbackEjercicio: userData.ultimoFeedbackEjercicio || 'Ninguno'
  };

  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al registrar el usuario.');
  }

  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: email, contrasenia: password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión.');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return mapUsuario(data.usuario);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: authHeaders()
  });

  if (!response.ok) {
    localStorage.removeItem('token');
    return null;
  }

  const data = await response.json();
  return mapUsuario(data);
};

export const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/api/usuarios`, { headers: authHeaders() });
  if (!response.ok) throw new Error('Error al obtener usuarios.');
  const data = await response.json();
  const arr = Array.isArray(data) ? data : (data.data || []);
  return arr.map(mapUsuario);
};

export const getPaginatedUsers = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/api/usuarios?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Error al obtener usuarios paginados.');
  const data = await response.json();
  const arr = Array.isArray(data) ? data : (data.data || []);
  return {
    data: arr.map(mapUsuario),
    total: data.total ?? arr.length,
    totalPages: data.totalPages ?? 1,
    currentPage: data.currentPage ?? page
  };
};

export const getUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/usuarios/${userId}`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Error al obtener el usuario.');
  const data = await response.json();
  return mapUsuario(data);
};

export const updateUser = async (userId, userData) => {
  const payload = { ...userData };
  if (userData.email) { payload.correo = userData.email; delete payload.email; }
  if (userData.password) { payload.contrasenia = userData.password; delete payload.password; }

  const response = await fetch(`${BASE_URL}/api/usuarios/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al actualizar el usuario.');
  }
  const data = await response.json();
  return mapUsuario(data);
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/usuarios/${userId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Error al eliminar el usuario.');
};

export const checkUserExists = async (email) => {
  const response = await fetch(`${BASE_URL}/api/usuarios?correo=${encodeURIComponent(email)}`, {
    headers: authHeaders()
  });
  if (!response.ok) return false;
  const data = await response.json();
  const arr = Array.isArray(data) ? data : (data.data || []);
  return arr.some(u => (u.correo || u.email || '').toLowerCase() === email.toLowerCase());
};

export const saveContactMessage = async (messageData) => {
  const response = await fetch(`${BASE_URL}/api/mensajes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(messageData)
  });
  if (!response.ok) throw new Error('Error al guardar el mensaje.');
  return await response.json();
};

export const getAllContactMessages = async () => {
  const response = await fetch(`${BASE_URL}/api/mensajes`, { headers: authHeaders() });
  if (!response.ok) throw new Error('Error al obtener los mensajes.');
  return await response.json();
};

export const deleteContactMessage = async (messageId) => {
  const response = await fetch(`${BASE_URL}/api/mensajes/${messageId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Error al eliminar el mensaje.');
};

export const actualizarImg = async (userId, imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('data:')) {
    throw new Error('La imagen no es una URL válida.');
  }
  const response = await fetch(`${BASE_URL}/api/usuarios/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ avatar: imageUrl })
  });
  if (!response.ok) throw new Error('Error al actualizar la imagen.');
  const data = await response.json();
  return mapUsuario(data);
};
