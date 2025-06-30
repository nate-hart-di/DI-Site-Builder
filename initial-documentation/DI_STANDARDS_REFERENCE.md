# Dealer Inspire (DI) Standards Reference

## Table of Contents

1. [Theme Architecture](#theme-architecture)
2. [File Organization](#file-organization)
3. [Design System](#design-system)
4. [Code Standards](#code-standards)
5. [Naming Conventions](#naming-conventions)
6. [Development Workflow](#development-workflow)
7. [Performance Standards](#performance-standards)
8. [Accessibility Requirements](#accessibility-requirements)

## Theme Architecture

### Child Theme Model

- **Parent Theme:** `DealerInspireCommonTheme`
- **Child Theme Location:** `dealer-themes/[theme-name]/`
- **Inheritance:** All customizations in child theme only
- **Restriction:** Never modify parent theme files directly

### Core Structure

```
dealer-themes/
  └── [theme-name]/
      ├── css/
      │   ├── _variables.scss              # Design system (770+ lines)
      │   ├── _section-name.scss           # Section-specific styles
      │   ├── home.scss                    # Homepage imports
      │   ├── style.scss                   # Main stylesheet
      │   └── themes/                      # Theme variants
      ├── partials/
      │   ├── hero/                        # Hero section variants
      │   ├── cta/                         # Call-to-action sections
      │   ├── content/                     # Content sections
      │   ├── header/                      # Header components
      │   ├── footer/                      # Footer components
      │   └── [section].php               # Section templates
      ├── di-acf-json/                     # ACF field definitions
      ├── images/                          # Theme assets
      ├── includes/
      │   └── js/
      │       ├── custom.js                # Custom JavaScript
      │       ├── min/                     # Minified versions
      │       └── sourcemaps/              # Source maps
      ├── front-page.php                   # Homepage template
      ├── functions.php                    # Theme functions
      └── README.md                        # Documentation
```

## File Organization

### CSS/SCSS Structure

- **Variables:** `_variables.scss` (770+ lines of design system)
- **Section Styles:** `_section-name.scss` files
- **Main Stylesheets:** `home.scss`, `style.scss`
- **Theme Variants:** `themes/_variant.scss`
- **Build Process:** SCSS → CSS via Gulp/compiler

### PHP Template Structure

- **Section Partials:** `/partials/[section]/`
- **Page Templates:** `[page-type].php`
- **ACF Integration:** JSON field definitions
- **Template Parts:** `get_template_part()` function

### Asset Organization

- **Images:** `/images/` directory
- **JavaScript:** `/includes/js/`
- **ACF Fields:** `/di-acf-json/`
- **Documentation:** README.md files

## Design System

### Core Variables (from \_variables.scss)

#### Colors

```scss
$primary: #007bff; // Site main color
$primaryhover: darken($primary, 10%);
$secondary: #2aa3d2; // Site accent color
$secondaryhover: darken($secondary, 10%);
$cta: #007bff; // CTA color
$ctahover: darken($cta, 10%);
$maintextcolor: #333; // Main text color
```

#### Typography

```scss
$maintextfont: 'Work Sans', sans-serif;
$heading-font: 'Work Sans', sans-serif;
$h2-font-weight: 700;
$h3-font-weight: 700;
$cta-font: 14px/30px;
```

#### Buttons

```scss
$button-fontfamily: $maintextfont;
$button-radius: 0px;
$button-padding: 16px 22px;
$button-transform: capitalize;
$cta-color: #fff;
$primary-color: #fff;
$secondary-color: #fff;
```

#### Layout & Spacing

```scss
$header-height-mobile: 55px;
$header-height-tablet: 70px;
$header-top-height: 30px;
$header-bottom-height: 80px;
$header-height-desktop: $header-bottom-height + $header-top-height + 1px;
$navbar-height: 80px;
$navbar-lineheight: 80px;
```

#### Navigation

```scss
$navbar-menuitem-color: #111;
$navbar-menuitem-hover-background: #f5f5f5;
$navbar-menuitem-hover-color: $primary;
$navbar-menuitem-font: $maintextfont;
$navbar-menuitem-fontweight: bold;
$navbar-current-background: #f5f5f5;
$navbar-submenu-background: #f5f5f5;
```

#### Social Icons

```scss
$sociallink-color: #fff;
$sociallink-backgroundcolor: $primary;
$sociallink-fontsize: 20px;
$sociallink-width: 50px;
$sociallink-height: 50px;
$sociallink-line-height: $sociallink-height;
$sociallink-margin: 5px;
$sociallink-radius: 50px;
$sociallink-border: none;
```

## Code Standards

### PHP Standards

- **WordPress Coding Standards:** Follow official WordPress PHP standards
- **Template Parts:** Use `get_template_part()` for includes
- **Output Escaping:** Always escape output (`esc_html()`, `esc_url()`, `esc_attr()`)
- **ACF Integration:** Use ACF for dynamic content management
- **Function Length:** Keep functions under 50 lines when possible

### SCSS Standards

- **BEM Methodology:** Block\_\_Element--Modifier naming
- **No Direct CSS:** Only edit .scss files, never .css directly
- **Media Queries:** Place at bottom of SCSS files
- **Variables:** Use design system variables from \_variables.scss
- **Mixins:** Import from DealerInspireCommonTheme
- **Responsive:** Mobile-first approach with breakpoints

### JavaScript Standards

- **Location:** `/includes/js/custom.js`
- **Minification:** Generate minified versions
- **Source Maps:** Include for debugging
- **jQuery:** Use when required by DI components
- **Performance:** Optimize for page load speed

## Naming Conventions

### BEM Methodology

```scss
.block {
  &__element {
    &--modifier {
      // Styles
    }
  }
}
```

### File Naming

- **SCSS Files:** `_section-name.scss` (underscore prefix)
- **PHP Partials:** `section-name.php`
- **Page Templates:** `page-type.php`
- **ACF JSON:** Descriptive names with .json extension

### Class Naming

- **Sections:** `sectionName` (camelCase)
- **Components:** `componentName`
- **Utilities:** `utility-name` (kebab-case)
- **States:** `is-active`, `has-children`

## Development Workflow

### Build Process

1. **SCSS Compilation:** Gulp or similar build tool
2. **Asset Optimization:** Minification and compression
3. **Source Maps:** Generated for debugging
4. **Version Control:** Only commit source files, not compiled

### ACF Workflow

1. **Field Definition:** Create in WordPress admin
2. **Export:** Save as JSON in `/di-acf-json/`
3. **Version Control:** Commit JSON files
4. **Import:** Sync across environments

### Testing Process

1. **Local Development:** Test in local environment
2. **Preview Server:** Use local preview for visual testing
3. **Cross-browser:** Test in multiple browsers
4. **Responsive:** Test on mobile, tablet, desktop
5. **Performance:** Validate page load speeds

## Performance Standards

### Page Load Optimization

- **Image Optimization:** Compress and lazy load images
- **CSS/JS Minification:** Minimize file sizes
- **Caching:** Implement appropriate caching strategies
- **CDN:** Use CDN for static assets when possible

### Code Performance

- **DOM Depth:** Minimize unnecessary wrapper elements
- **CSS Specificity:** Avoid overly specific selectors
- **JavaScript:** Minimize DOM queries and operations
- **Database:** Optimize ACF queries and WordPress queries

### Asset Management

- **Image Formats:** Use appropriate formats (WebP, SVG, etc.)
- **Font Loading:** Optimize web font loading
- **Script Loading:** Defer non-critical JavaScript
- **CSS Loading:** Critical CSS inline, non-critical deferred

## Accessibility Requirements

### HTML Semantics

- **Semantic Elements:** Use `<section>`, `<nav>`, `<main>`, `<article>`
- **Heading Hierarchy:** Proper h1-h6 structure
- **Landmarks:** Include ARIA landmarks where needed
- **Lists:** Use appropriate list elements

### Keyboard Navigation

- **Focus Management:** Visible focus indicators
- **Tab Order:** Logical tab sequence
- **Skip Links:** Provide skip navigation links
- **Interactive Elements:** All interactive elements keyboard accessible

### Screen Reader Support

- **Alt Text:** Descriptive alt text for images
- **ARIA Labels:** Use ARIA attributes appropriately
- **Form Labels:** Proper label associations
- **Error Messages:** Clear error messaging

### Color and Contrast

- **Color Contrast:** WCAG AA compliance (4.5:1 ratio)
- **Color Independence:** Don't rely solely on color for information
- **Focus Indicators:** High contrast focus indicators
- **Text Readability:** Sufficient contrast for all text

## Content Management

### ACF Integration

- **Field Groups:** Organized by page type or section
- **Repeater Fields:** For flexible content layouts
- **Flexible Content:** For modular page building
- **JSON Export:** Version controlled field definitions

### Dynamic Content

- **Conditional Logic:** Use ACF conditional logic
- **Fallback Content:** Provide default content
- **Error Handling:** Graceful handling of missing content
- **Performance:** Optimize ACF queries

## Security Standards

### Data Sanitization

- **Input Validation:** Validate all user inputs
- **Output Escaping:** Escape all output
- **SQL Injection:** Use prepared statements
- **XSS Prevention:** Sanitize and escape user data

### File Security

- **Upload Restrictions:** Limit file types and sizes
- **Path Validation:** Validate file paths
- **Permission Management:** Proper file permissions
- **HTTPS:** Use HTTPS for all connections

## Documentation Standards

### Code Documentation

- **PHP Comments:** Document complex functions and logic
- **SCSS Comments:** Document complex styles and variables
- **README Files:** Include in each theme directory
- **Inline Documentation:** Comment complex business logic

### Process Documentation

- **Setup Instructions:** Document installation and setup
- **Customization Guide:** Document theme customization
- **Troubleshooting:** Common issues and solutions
- **Best Practices:** Development guidelines and standards
