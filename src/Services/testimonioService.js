const API_URL = 'http://localhost:3001';

export const fetchStoriesData = async () => {
    const [storiesRes, contributorsRes, topicsRes] = await Promise.all([
        fetch(`${API_URL}/stories`),
        fetch(`${API_URL}/topContributors`),
        fetch(`${API_URL}/trendingTopics`)
    ]);

    if (!storiesRes.ok || !contributorsRes.ok || !topicsRes.ok) {
        throw new Error('Error al cargar la información.');
    }

    const storiesData = await storiesRes.json();
    const contributorsData = await contributorsRes.json();
    const topicsData = await topicsRes.json();

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
    const response = await fetch(`${API_URL}/stories?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Error al cargar las historias del usuario.');
    }
    return await response.json();
};
