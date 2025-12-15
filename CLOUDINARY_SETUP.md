# Cloudinary Setup Guide

Your portfolio app is configured to use Cloudinary for image uploads. Follow these steps to complete the setup:

## 1. Create a Cloudinary Account
- Go to [https://cloudinary.com/](https://cloudinary.com/)
- Sign up for a free account (includes 25GB storage and 25GB bandwidth/month)

## 2. Get Your Credentials
- After logging in, go to your [Dashboard](https://console.cloudinary.com/)
- You'll see your credentials in the "Product Environment Credentials" section:
  - **Cloud Name** (e.g., `dxyz123abc`)
  - **API Key** (e.g., `123456789012345`)
  - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

## 3. Add Credentials to .env
- Open your `.env` file in the `server` directory
- Replace the placeholder values:
  \`\`\`env
  CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
  CLOUDINARY_API_KEY=your_actual_api_key
  CLOUDINARY_API_SECRET=your_actual_api_secret
  \`\`\`

## 4. Restart Your Server
\`\`\`bash
cd server
npm run dev
\`\`\`

## 5. Test the Upload
- Log in to your admin dashboard
- Create or edit a project
- Upload a thumbnail or add gallery images
- Images will be uploaded to Cloudinary and stored in the `portfolio` folder

## Current Features
✅ Single image upload (thumbnails)
✅ Multiple image uploads (gallery)
✅ Drag-and-drop reordering
✅ Image captions
✅ 10MB file size limit
✅ Automatic optimization (1200px max width)
✅ Supported formats: JPG, JPEG, PNG, GIF, WebP

## Folder Structure in Cloudinary
All images are uploaded to: `portfolio/` folder in your Cloudinary account
