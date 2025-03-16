# Orca Construction Assets Directory Structure

This directory contains all the assets for the Orca Construction calculators and galleries. The structure is organized by trades and product types to scale with the growing number of products and images.

## Directory Structure

```
Assets/
├── logo/                   # Company logos and branding assets
│   ├── ORE-horizontal-full.png
│   └── ORE-tail.png
├── trades/                 # Main trades directory
│   ├── decking/           # Decking trade assets
│   │   ├── railings/      # Railing product types
│   │   │   ├── aluminum/          # Contains aluminum railing photos
│   │   │   ├── cable-aluminum/    # Contains cable & aluminum railing photos
│   │   │   ├── cable-cedar/       # Contains cable & cedar railing photos
│   │   │   ├── cedar/             # Contains cedar railing photos
│   │   │   ├── cedar-hogwire/     # Contains cedar & hogwire railing photos
│   │   │   ├── composite/         # Contains composite railing photos
│   │   │   └── glass/             # Contains glass railing photos
│   │   └── decking/       # Decking product types
│   │       ├── cedar-4/           # Contains 4" cedar decking photos
│   │       ├── cedar-6/           # Contains 6" cedar decking photos
│   │       ├── timbertech-prime/  # Contains TimberTech Prime photos
│   │       ├── timbertech-landmark/ # Contains TimberTech Landmark photos
│   │       └── timbertech-vintage/ # Contains TimberTech Vintage photos
│   └── roofing/           # Roofing trade assets
│       ├── shingles/      # Contains shingle product photos
│       ├── ventilation/   # Contains ventilation product photos
│       └── gutters/       # Contains gutter product photos
```

## Usage Guidelines

1. Each trade has its own directory under `trades/`
2. Within each trade directory, create subdirectories for different product categories
3. Each product category contains directories for specific product types
4. Product type directories contain the photos directly (no additional subdirectories)
5. Use lowercase and hyphen-separated names for directories
6. Keep image names descriptive and consistent within each category

## Adding New Content

When adding new trades or products:

1. Follow the existing directory structure pattern
2. Create appropriate subdirectories for new product categories
3. Update relevant HTML/CSS files to point to the new asset locations
4. Maintain consistent naming conventions
5. Add appropriate README files for new major sections

## Image Guidelines

- Use descriptive filenames (e.g., `front-view-installation.jpg`)
- Optimize images for web use before adding
- Keep image resolutions consistent within each category
- Include before/after photos when applicable
- Add captions or descriptions in a separate metadata file if needed 