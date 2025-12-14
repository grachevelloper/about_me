export const generateKey = (originalName: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = originalName.split(".").pop();
    return `uploads/${timestamp}-${random}.${ext}`;
};
