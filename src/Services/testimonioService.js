const API_URL = 'http://localhost:3001';

export const fetchStoriesData = async () => {
    const [storiesRes, contributorsRes, topicsRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/stories`),
        fetch(`${API_URL}/topContributors`),
        fetch(`${API_URL}/trendingTopics`),
        fetch(`${API_URL}/comentarios`)
    ]);

    if (!storiesRes.ok || !contributorsRes.ok || !topicsRes.ok) {
        throw new Error('Error al cargar la información.');
    }

    const storiesData = await storiesRes.json();
    const contributorsData = await contributorsRes.json();
    const topicsData = await topicsRes.json();
    
    let commentsData = [];
    if (commentsRes.ok) {
        commentsData = await commentsRes.json();
    }
    
    // Attach accurate comments count to each story
    storiesData.forEach(story => {
        const storyComments = commentsData.filter(c => String(c.storyId) === String(story.id));
        story.comments = storyComments.length;
    });

    return { storiesData, contributorsData, topicsData };
};

export const createStory = async (storyPayload) => {
    const response = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(storyPayload)
    });

    if (!response.ok) {
        throw new Error('Hubo un error al publicar tu historia.');
    }

    return await response.json();
};

export const updateStoryLikes = async (storyId, newLikes, likedBy) => {
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            likes: newLikes,
            likedBy: likedBy
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
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments: newCount })
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el contador de comentarios.');
    }
    return await response.json();
};

export const getStoriesByUserId = async (userId) => {
    const [storiesRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/stories?userId=${userId}`),
        fetch(`${API_URL}/comentarios`)
    ]);
    if (!storiesRes.ok) {
        throw new Error('Error al cargar las historias del usuario.');
    }
    
    const stories = await storiesRes.json();
    let commentsData = [];
    if (commentsRes.ok) {
        commentsData = await commentsRes.json();
    }
    
    stories.forEach(story => {
        story.comments = commentsData.filter(c => String(c.storyId) === String(story.id)).length;
    });
    
    return stories;
};

export const createReport = async (reportPayload) => {
    const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...reportPayload,
            status: 'pending',
            fecha: new Date().toISOString()
        })
    });
    if (!response.ok) {
        throw new Error('Error al enviar el reporte.');
    }
    return await response.json();
};

export const getAllReports = async () => {
    const response = await fetch(`${API_URL}/reports`);
    if (!response.ok) {
        throw new Error('Error al cargar los reportes.');
    }
    return await response.json();
};

export const deleteReport = async (reportId) => {
    const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'DELETE'
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
