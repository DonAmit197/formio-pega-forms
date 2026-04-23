const fs = require("fs");
const path = require("path");



function safeName(name) {
  return (name || "upload").replace(/\s+/g, "_").replace(/[^\w.\-]/g, "");
}

async function uploadToLocal(file) {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filename = `${Date.now()}_${safeName(file.originalname)}`;
  fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);

  const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  return {
    url: `${baseUrl}/uploads/${filename}`,
    fileId: filename,
    
  };
}



async function uploadSingle(req, res) {
  try {
    const f = req.file;
    if (!f) return res.status(400).json({ message: "No file received" });

     const result = await uploadToLocal(f);

    // Form.io-friendly response
    return res.json([
      {
        storage: "url",
        name: f.originalname,
        size: f.size,
        type: f.mimetype,
        url: result.url,
        
        
      },
    ]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Upload failed",
      error: err && err.message ? err.message : String(err),
    });
  }
}

module.exports = { uploadSingle };