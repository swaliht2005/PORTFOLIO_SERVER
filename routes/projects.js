
import express from "express"
import Project from "../models/Project.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    console.error("Get projects error:", err)
    res.status(500).json({ message: err.message })
  }
})

// Get single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    res.json(project)
  } catch (err) {
    console.error("Get project error:", err)
    res.status(500).json({ message: err.message })
  }
})

// Create project (Admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("Creating project - Request received")

    if (!req.body || !req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({ message: "Title is required" })
    }

    if (!req.body.thumbnailUrl || req.body.thumbnailUrl.trim() === "") {
      return res.status(400).json({ message: "Thumbnail URL is required" })
    }

    const cleanedData = { ...req.body }

    // Clean up images array
    if (cleanedData.images && Array.isArray(cleanedData.images)) {
      cleanedData.images = cleanedData.images.filter((img) => img && img.url && img.url.trim() !== "")
    } else {
      cleanedData.images = []
    }

    // Ensure arrays are properly formatted
    cleanedData.tags = Array.isArray(cleanedData.tags) ? cleanedData.tags : []
    cleanedData.tools = Array.isArray(cleanedData.tools) ? cleanedData.tools : []
    cleanedData.contentModules = Array.isArray(cleanedData.contentModules) ? cleanedData.contentModules : []

    const project = new Project(cleanedData)
    const newProject = await project.save()

    console.log("Project created successfully:", newProject._id)
    res.status(201).json(newProject)
  } catch (err) {
    console.error("Error creating project:", err)

    let errorMessage = err.message || "Failed to create project"

    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors || {})
        .map((e) => e.message)
        .join(", ")
      errorMessage = validationErrors || errorMessage
    }

    const statusCode = err.name === "ValidationError" ? 400 : 500
    res.status(statusCode).json({ message: errorMessage })
  }
})

// Update project
router.put("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Updating project:", req.params.id)

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Update fields
    const allowedFields = [
      "title",
      "description",
      "imageUrl",
      "thumbnailUrl",
      "liveLink",
      "repoLink",
      "tags",
      "category",
      "tools",
      "client",
      "year",
      "role",
      "status",
      "images",
      "contentModules",
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field]
      }
    })

    const updatedProject = await project.save()
    console.log("Project updated successfully")
    res.json(updatedProject)
  } catch (err) {
    console.error("Error updating project:", err)
    res.status(400).json({ message: err.message || "Failed to update project" })
  }
})

// Delete project
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json({ message: "Project deleted successfully" })
  } catch (err) {
    console.error("Delete project error:", err)
    res.status(500).json({ message: err.message })
  }
})

export default router
