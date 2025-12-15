
import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "Uncategorized" },
    tools: [String],
    client: { type: String },
    year: { type: String },
    role: { type: String },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    imageUrl: { type: String },
    thumbnailUrl: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        id: { type: String },
      },
    ],
    contentModules: [
      {
        id: String,
        type: {
          type: String,
          enum: ["image", "text", "photo-grid", "video", "embed", "lightroom", "prototype", "3d"],
          default: "text",
        },
        content: mongoose.Schema.Types.Mixed, // flexible structure for different modules
        styles: { type: Object, default: {} },
      },
    ],
    liveLink: { type: String },
    repoLink: { type: String },
    tags: [String],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.model("Project", projectSchema)
