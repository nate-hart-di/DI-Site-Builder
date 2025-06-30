# DI Local Development Environment & Feedback Loop

## Overview

This document outlines the Dealer Inspire local development environment setup and the critical feedback loop needed for Figma-to-code automation. The ultimate goal is to create a seamless workflow that continuously refines generated code until the localhost preview matches the Figma design exactly.

## Local Development Environment

### DI Websites Platform Structure

```
di-websites-platform/
├── dealer-themes/                    # Custom theme directory
│   ├── [theme-name]/                # Individual dealer themes
│   │   ├── css/                     # SCSS stylesheets
│   │   ├── partials/                # PHP templates
│   │   ├── di-acf-json/             # ACF field definitions
│   │   ├── images/                  # Theme assets
│   │   ├── includes/js/             # Custom JavaScript
│   │   ├── front-page.php           # Homepage template
│   │   ├── functions.php            # Theme functions
│   │   └── README.md                # Documentation
│   └── DealerInspireCommonTheme/    # Parent theme (read-only)
├── docker/                          # Docker configuration
├── docker-compose.yml               # Local environment setup
├── .env                             # Environment variables
└── README.md                        # Platform documentation
```

### Docker Environment Setup

#### Prerequisites

- Docker Desktop
- Docker Compose
- Git
- Node.js (for build tools)
- PHP Composer

#### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - '8080:80'
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress_password
    volumes:
      - ./dealer-themes:/var/www/html/wp-content/themes
      - ./uploads:/var/www/html/wp-content/uploads
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - '8081:80'
    environment:
      PMA_HOST: mysql
      PMA_USER: wordpress
      PMA_PASSWORD: wordpress_password
    depends_on:
      - mysql

volumes:
  mysql_data:
```

#### Environment Variables

```bash
# .env
WORDPRESS_DB_HOST=mysql
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress_password
WORDPRESS_DEBUG=true
WORDPRESS_DEVELOPMENT=true
```

### Local Development Workflow

#### Initial Setup

```bash
# Clone the platform
git clone [repository-url] di-websites-platform
cd di-websites-platform

# Start Docker environment
docker-compose up -d

# Install WordPress
# Visit http://localhost:8080 to complete WordPress setup

# Install required plugins
# - Advanced Custom Fields PRO
# - DI Slider
# - Other DI-specific plugins

# Activate theme
# - Upload and activate DealerInspireCommonTheme
# - Create child theme for development
```

#### Development Process

```bash
# 1. Create child theme
mkdir dealer-themes/[theme-name]
cp -r dealer-themes/DealerInspireCommonTheme/* dealer-themes/[theme-name]/

# 2. Customize theme
# Edit files in dealer-themes/[theme-name]/

# 3. Build assets
cd dealer-themes/[theme-name]
npm install
gulp build

# 4. Test locally
# Visit http://localhost:8080 to view changes
```

## Feedback Loop Architecture

### The Ultimate Goal: Continuous Refinement

The feedback loop should enable:

1. **Figma Design** → Extract design tokens and component structure
2. **Code Generation** → Generate PHP partials and SCSS
3. **Local Preview** → View generated code on localhost
4. **Visual Comparison** → Compare localhost to Figma design
5. **Code Refinement** → Adjust code to match design
6. **Repeat** → Until localhost matches Figma exactly

### Current Tools & Capabilities

#### Playwright Integration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'docker-compose up -d',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Browserbase Integration

```typescript
// browserbase.config.ts
export default {
  baseUrl: 'http://localhost:8080',
  viewport: { width: 1920, height: 1080 },
  screenshotPath: './screenshots',
  comparisonThreshold: 0.1,
  devices: [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ],
};
```

### Required Tool Capabilities

#### 1. Localhost Access & Permissions

**Challenge:** Most visual comparison tools can't access localhost URLs
**Solution:** Need tool that can:

- Access localhost:8080 (Docker WordPress environment)
- Handle authentication if required
- Navigate to specific pages/sections
- Capture screenshots of local content

#### 2. Figma Design Extraction

**Current Capability:** Extract design tokens and component structure
**Enhanced Need:**

- Extract visual layout information
- Capture component hierarchy
- Extract spacing and positioning data
- Identify interactive elements

#### 3. Visual Comparison Engine

**Requirements:**

- Compare Figma designs to localhost screenshots
- Identify visual differences (layout, colors, spacing, typography)
- Generate difference reports with specific areas highlighted
- Provide quantitative similarity scores

#### 4. Automated Code Refinement

**Workflow:**

- Analyze visual differences
- Generate code adjustments
- Apply changes to PHP/SCSS files
- Rebuild and redeploy to localhost
- Re-test and compare

### Proposed Feedback Loop Implementation

#### Phase 1: Setup & Configuration

```bash
# 1. Configure local environment
docker-compose up -d
npm install
npm run setup:figma-integration

# 2. Configure visual comparison tool
npm run setup:visual-comparison

# 3. Set up Figma API access
export FIGMA_API_TOKEN=your-token
export FIGMA_FILE_ID=your-file-id
```

#### Phase 2: Initial Generation

```bash
# 1. Extract from Figma
npm run figma:extract

# 2. Generate initial code
npm run code:generate

# 3. Deploy to localhost
npm run deploy:local
```

#### Phase 3: Feedback Loop

```bash
# 1. Capture localhost screenshots
npm run capture:localhost

# 2. Compare with Figma
npm run compare:visual

# 3. Generate refinement suggestions
npm run analyze:differences

# 4. Apply refinements
npm run refine:code

# 5. Rebuild and redeploy
npm run rebuild:local

# 6. Repeat until match
```

### Tool Requirements

#### Essential Features

1. **Localhost Access:**

   - Ability to access http://localhost:8080
   - Handle Docker container networking
   - Support for WordPress authentication
   - Page navigation and interaction

2. **Visual Comparison:**

   - Screenshot capture from localhost
   - Figma design overlay comparison
   - Pixel-perfect difference detection
   - Layout and spacing analysis

3. **Code Integration:**

   - Read generated PHP/SCSS files
   - Suggest specific code changes
   - Apply refinements automatically
   - Maintain DI coding standards

4. **Feedback Loop:**
   - Continuous monitoring and comparison
   - Automated refinement suggestions
   - Progress tracking and reporting
   - Convergence detection

#### Recommended Tools

1. **Playwright:** Browser automation and screenshot capture
2. **Browserbase:** Visual comparison and testing
3. **Figma API:** Design extraction and comparison
4. **Custom CLI:** Integration and automation
5. **Docker API:** Container management and deployment

### Implementation Strategy

#### Step 1: Local Environment Setup

```bash
# Create development environment
mkdir di-figma-feedback
cd di-figma-feedback

# Initialize project
npm init -y
npm install playwright @playwright/test
npm install figma-api
npm install docker-compose

# Configure environment
cp ../di-websites-platform/docker-compose.yml .
cp ../di-websites-platform/.env .
```

#### Step 2: Visual Comparison Setup

```typescript
// src/visual-comparison.ts
import { FigmaAPI } from 'figma-api';
import { chromium } from 'playwright';

export class VisualComparison {
  async captureLocalhost(url: string, selector: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector);
    const screenshot = await page.screenshot({
      clip: await page.locator(selector).boundingBox(),
    });
    await browser.close();
    return screenshot;
  }

  async compareWithFigma(localhostScreenshot: Buffer, figmaNodeId: string) {
    // Implement comparison logic
    // Return difference report
  }
}
```

#### Step 3: Feedback Loop Implementation

```typescript
// src/feedback-loop.ts
export class FeedbackLoop {
  async runIteration() {
    // 1. Capture current state
    const screenshot = await this.captureLocalhost();

    // 2. Compare with Figma
    const differences = await this.compareWithFigma(screenshot);

    // 3. Generate refinements
    const refinements = await this.generateRefinements(differences);

    // 4. Apply changes
    await this.applyRefinements(refinements);

    // 5. Rebuild and redeploy
    await this.rebuildLocal();

    // 6. Check convergence
    return this.checkConvergence();
  }
}
```

### Security Considerations

#### Localhost Access

- **Network Security:** Ensure Docker containers are properly isolated
- **Authentication:** Handle WordPress admin authentication securely
- **Permissions:** Grant minimal required permissions to comparison tools
- **Data Protection:** Secure storage of screenshots and comparison data

#### API Security

- **Figma API:** Secure token storage and usage
- **Rate Limiting:** Respect API rate limits
- **Error Handling:** Graceful handling of API failures
- **Logging:** Secure logging of API interactions

### Performance Optimization

#### Docker Environment

- **Resource Allocation:** Optimize CPU and memory allocation
- **Volume Mounting:** Efficient file system access
- **Caching:** Implement build and dependency caching
- **Parallel Processing:** Run multiple comparisons concurrently

#### Visual Comparison

- **Image Optimization:** Compress screenshots for faster processing
- **Selective Comparison:** Compare only changed areas
- **Caching:** Cache comparison results
- **Batch Processing:** Process multiple sections simultaneously

### Monitoring & Reporting

#### Progress Tracking

- **Iteration Count:** Track number of refinement cycles
- **Convergence Metrics:** Measure improvement over time
- **Performance Metrics:** Track build and comparison times
- **Quality Metrics:** Measure visual similarity scores

#### Reporting

- **Visual Reports:** Side-by-side comparisons
- **Difference Reports:** Highlighted areas of mismatch
- **Progress Reports:** Improvement over iterations
- **Final Report:** Summary of achieved results

### Future Enhancements

#### Advanced Features

- **AI-Powered Refinement:** Machine learning for better code suggestions
- **Real-time Sync:** Live Figma-to-code synchronization
- **Multi-device Testing:** Test across multiple viewport sizes
- **Performance Testing:** Validate page load speeds and performance

#### Integration Opportunities

- **CI/CD Pipeline:** Automated testing and deployment
- **Team Collaboration:** Shared feedback and refinement history
- **Design System Sync:** Real-time design system updates
- **Analytics:** Track usage patterns and optimization opportunities

## Conclusion

The feedback loop between Figma and localhost is the critical missing piece for achieving pixel-perfect code generation. By implementing a robust visual comparison system that can access localhost and continuously refine generated code, we can create a truly automated Figma-to-code workflow that produces production-ready DI themes.

The key challenges are:

1. **Localhost Access:** Ensuring comparison tools can access Docker containers
2. **Visual Comparison:** Accurate detection of visual differences
3. **Code Refinement:** Intelligent suggestions for code improvements
4. **Automation:** Seamless integration of all components

With the right tools and implementation strategy, this feedback loop can dramatically reduce development time and improve code quality for DI theme development.
