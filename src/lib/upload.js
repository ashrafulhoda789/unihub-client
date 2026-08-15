
export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary Cloud Name or Upload Preset is missing in environment variables.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // Determine resource type for Cloudinary
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    // Images/Videos uses standard resource_type, PDFs & raw files use 'raw' or 'auto'
    const resourceType = isVideo ? 'video' : isImage ? 'image' : 'auto';

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            let fileType = 'document';
            if (file.type.includes('pdf')) fileType = 'pdf';
            else if (isVideo) fileType = 'video';
            else if (isImage) fileType = 'image';

            return {
                url: data.secure_url,
                type: fileType,
                publicId: data.public_id
            };
        } else {
            throw new Error(data.error?.message || "Cloudinary upload failed.");
        }
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};