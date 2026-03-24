function SubirImagen({ onImageUpload, children }) {
    const openWidget = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: "dg5pkjvvr",
                uploadPreset: "imagenes",
                sources: ["local", "camera"],
                multiple: false,
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    const imageUrl = result.info.secure_url;

                    if (onImageUpload) {
                        onImageUpload(imageUrl);
                    }
                }
            }
        );
    };

    return (
        <span onClick={openWidget} style={{ display: 'contents', cursor: 'pointer' }}>
            {children || <button className="btn-upload-avatar" style={{marginTop: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Cambiar foto</button>}
        </span>
    );
}

export default SubirImagen;