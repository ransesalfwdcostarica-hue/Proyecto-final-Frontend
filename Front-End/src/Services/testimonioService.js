import { MOCK_BASE_URL, API_BASE_URL } from './apiConfig';
const API_URL = MOCK_BASE_URL;

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const fetchStoriesData = async () => {
    const [storiesRes, contributorsRes, topicsRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/stories`),
        fetch(`${API_BASE_URL}/api/contribuidores`, {
            headers: authHeaders()
        }),
        fetch(`${API_URL}/trendingTopics`),
        fetch(`${API_URL}/comentarios`)
    ]);

    if (!storiesRes.ok || !contributorsRes.ok || !topicsRes.ok) {
        throw new Error('Error al cargar la información.');
    }


    const storiesDataRaw = await storiesRes.json();
    const contributorsData = await contributorsRes.json();
    const topicsData = await topicsRes.json();
    
    let commentsData = [];
    if (commentsRes.ok) {
        commentsData = await commentsRes.json();
    }
    
    // Map backend fields and mock fields defensively
    const storiesData = storiesDataRaw.map(s => ({
        id: s.id || s.idpublicaciones,
        title: s.title || s.titulo,
        text: s.text || s.texto,
        image: s.image || s.imagen,
        time: s.time || s.tiempo_Publicacion,
        userId: s.userId || s.Usuario_idUsuario,
        category: s.category || (s.CategoriaPublicacion ? s.CategoriaPublicacion.nombre : 'Pérdida de Peso'),
        tag: s.tag || (s.CategoriaPublicacion ? s.CategoriaPublicacion.nombre : 'Pérdida de Peso'),
        userName: s.userName || s.Usuario?.nombre,
        userAvatar: s.userAvatar || s.Usuario?.Perfil?.foto_perfil,
        likedBy: s.likedBy || [],
        fecha: s.fecha || s.time,
        likes: s.likes || 0,
        comments: 0 // Will be calculated below
    }));

    // Attach accurate comments count to each story
    storiesData.forEach(story => {
        const storyComments = commentsData.filter(c => String(c.storyId) === String(story.id));
        story.comments = storyComments.length;
    });

    return { storiesData, contributorsData, topicsData };
};

export const createStory = async (storyPayload) => {
    const payload = {
        title: storyPayload.title,
        text: storyPayload.text,
        image: storyPayload.image,
        category: storyPayload.category,
        tag: storyPayload.category,
        userId: storyPayload.userId,
        userName: storyPayload.userName,
        userAvatar: storyPayload.userAvatar,
        time: storyPayload.time || "Justo ahora",
        fecha: storyPayload.fecha || new Date().toISOString(),
        likes: 0,
        likedBy: []
    };
    
    const response = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Hubo un error al publicar tu historia.');
    }

    const rawStory = await response.json();
    return {
        id: rawStory.id,
        title: rawStory.title,
        text: rawStory.text,
        image: rawStory.image,
        time: rawStory.time,
        fecha: rawStory.time,
        userId: rawStory.userId,
        category: rawStory.category,
        tag: rawStory.tag,
        userName: storyPayload.userName,
        userAvatar: storyPayload.userAvatar,
        likes: 0,
        comments: 0,
        likedBy: []
    };
};

export const updateStoryLikes = async (storyId, newLikes, likedBy) => {
    // First get the story to preserve existing fields
    const getResponse = await fetch(`${API_URL}/stories/${storyId}`);
    if (!getResponse.ok) {
        throw new Error('Error al buscar la historia.');
    }
    const story = await getResponse.json();

    const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            ...story,
            likes: newLikes,
            likedBy: likedBy || []
        })
    });

    if (!response.ok) {
        throw new Error('Hubo un error al actualizar los likes.');
    }

    return await response.json();
};

export const deleteStory = async (storyId) => {
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Hubo un error al eliminar el testimonio.');
    }

    return response;
};

export const fetchCommentsByStory = async (storyId) => {
    const response = await fetch(`${API_URL}/comentarios?storyId=${storyId}`);
    if (!response.ok) {
        throw new Error('Error al cargar los comentarios.');
    }
    return await response.json();
};

export const addComment = async (commentPayload) => {
    const response = await fetch(`${API_URL}/comentarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentPayload)
    });
    if (!response.ok) {
        throw new Error('Error al publicar el comentario.');
    }
    return await response.json();
};

export const updateStoryCommentsCount = async (storyId, newCount) => {
    // In json-server, this is computed dynamically or updated on the story.
    // Fetch story first.
    const getResponse = await fetch(`${API_URL}/stories/${storyId}`);
    if (getResponse.ok) {
        const story = await getResponse.json();
        await fetch(`${API_URL}/stories/${storyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...story, commentsCount: newCount })
        });
    }
};

export const getStoriesByUserId = async (userId) => {
    const [storiesRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/stories?userId=${userId}`),
        fetch(`${API_URL}/comentarios`)
    ]);
    if (!storiesRes.ok) {
        throw new Error('Error al cargar las historias del usuario.');
    }
    
    const storiesRaw = await storiesRes.json();
    let commentsData = [];
    if (commentsRes.ok) {
        commentsData = await commentsRes.json();
    }
    
    const stories = storiesRaw.map(s => ({
        id: s.id,
        title: s.title,
        text: s.text,
        image: s.image,
        time: s.time,
        userId: s.userId,
        userName: s.userName || s.Usuario?.nombre,
        userAvatar: s.userAvatar || s.Usuario?.Perfil?.foto_perfil,
        likedBy: s.likedBy || [],
        fecha: s.fecha || s.time,
        likes: s.likes || 0,
        comments: 0
    }));

    stories.forEach(story => {
        story.comments = commentsData.filter(c => String(c.storyId) === String(story.id)).length;
    });
    
    return stories;
};

export const createReport = async (reportPayload) => {
    const response = await fetch(`${API_BASE_URL}/api/reportes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
            storyId: reportPayload.storyId,
            reporterId: reportPayload.reporterId,
            reason: reportPayload.reason || 'Spam',
            subReason: reportPayload.subReason || '',
            otherText: reportPayload.otherText || '',
            status: reportPayload.status || 'pending',
            fecha: reportPayload.fecha || new Date().toISOString()
        })
    });
    if (!response.ok) {
        throw new Error('Error al enviar el reporte.');
    }
    return await response.json();
};

export const getAllReports = async () => {
    const response = await fetch(`${API_BASE_URL}/api/reportes`, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error('Error al cargar los reportes.');
    }
    return await response.json();
};

export const deleteReport = async (reportId) => {
    const response = await fetch(`${API_BASE_URL}/api/reportes/${reportId}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el reporte.');
    }
    return response;
};


export const getStoryById = async (storyId) => {
    const response = await fetch(`${API_URL}/stories/${storyId}`);
    if (!response.ok) {
        throw new Error('Error al cargar la historia.');
    }
    return await response.json();
};
