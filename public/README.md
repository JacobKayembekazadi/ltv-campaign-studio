# Public Assets Directory

This directory contains static assets that are served directly by the web server and can be accessed via URL paths.

## Directory Structure

```
public/
├── images/
│   ├── logos/          # Brand logos and company logos
│   ├── icons/          # UI icons and interface elements
│   ├── campaigns/      # Campaign-related images and banners
│   ├── avatars/        # User profile pictures and avatars
│   └── backgrounds/    # Background images and patterns
├── videos/
│   ├── campaigns/      # Campaign promotional videos
│   ├── demos/          # Product demonstration videos
│   └── tutorials/      # How-to and tutorial videos
└── README.md          # This file
```

## Usage Guidelines

### Images
- **Logos**: Store brand logos, company logos, and partner logos
  - Recommended formats: SVG (preferred), PNG with transparency
  - Naming convention: `company-name-logo.svg`

- **Icons**: Store UI icons and interface elements
  - Recommended formats: SVG (preferred), PNG for raster icons
  - Naming convention: `icon-name.svg`

- **Campaigns**: Store campaign-specific images, banners, and graphics
  - Recommended formats: JPG, PNG, WebP
  - Naming convention: `campaign-name-image-type.jpg`

- **Avatars**: Store user profile pictures and default avatars
  - Recommended formats: JPG, PNG, WebP
  - Naming convention: `avatar-identifier.jpg`

- **Backgrounds**: Store background images and patterns
  - Recommended formats: JPG, PNG, WebP
  - Naming convention: `background-name.jpg`

### Videos
- **Campaigns**: Store promotional and marketing videos for campaigns
  - Recommended formats: MP4 (H.264), WebM
  - Naming convention: `campaign-name-video.mp4`

- **Demos**: Store product demonstration and feature showcase videos
  - Recommended formats: MP4 (H.264), WebM
  - Naming convention: `demo-feature-name.mp4`

- **Tutorials**: Store instructional and how-to videos
  - Recommended formats: MP4 (H.264), WebM
  - Naming convention: `tutorial-topic.mp4`

## File Size Recommendations

### Images
- **Icons**: < 50KB (SVG preferred)
- **Logos**: < 100KB (SVG preferred)
- **Avatars**: < 200KB
- **Campaign Images**: < 500KB
- **Backgrounds**: < 1MB

### Videos
- **Short Clips** (< 30s): < 5MB
- **Demo Videos** (1-3 min): < 25MB
- **Tutorial Videos** (3-10 min): < 100MB

## Optimization Tips

1. **Use appropriate formats**:
   - SVG for scalable graphics and icons
   - WebP for modern browsers (with JPG/PNG fallback)
   - MP4 for videos with broad compatibility

2. **Compress images** before adding to the project
3. **Use descriptive filenames** without spaces (use hyphens instead)
4. **Consider lazy loading** for large images and videos
5. **Provide multiple resolutions** for responsive images when needed

## Accessing Assets in Code

In your React components, you can access these assets using:

```tsx
// For images
<img src="/images/logos/company-logo.svg" alt="Company Logo" />

// For videos
<video src="/videos/demos/feature-demo.mp4" controls />

// Or using dynamic imports for better optimization
import logoUrl from '/images/logos/company-logo.svg';
```

## Git LFS Recommendation

For large video files (> 10MB), consider using Git LFS (Large File Storage) to avoid bloating your repository.