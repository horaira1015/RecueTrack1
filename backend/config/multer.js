const fs = require('fs').promises;
const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
};

// Define the upload directory
const UPLOAD_DIR = path.join(__dirname, '..',  'uploads');

// Ensure the directory exists before using it
async function ensureUploadDir() {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
        console.error("Error creating upload directory:", error);
    }
}

// Call the function on startup
ensureUploadDir();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await ensureUploadDir(); // Ensure the directory exists
            cb(null, UPLOAD_DIR);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const extension = MIME_TYPES[file.mimetype] || 'jpg'; // Default to 'jpg' if unknown
        const filename = `${Date.now()}.${extension}`;
        cb(null, filename);
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (!MIME_TYPES[file.mimetype]) {
        return cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed!'), false);
    }
    cb(null, true);
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter
});

// ✅ Export the `upload` instance WITHOUT `.single('idProof')`
module.exports = upload;
