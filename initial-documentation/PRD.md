# Product Requirements Documentation - DI Site Builder

1. Introduction & Vision

DI Site Builder is the official name for the internal developer tool designed to fundamentally automate and accelerate the Dealer Inspire website creation process. The name is direct and ambitious, reflecting the project's ultimate goal: to move beyond single-component generation and streamline the building of entire sites directly from Figma.

While the name implies a broad scope, the core of its power lies in a specific, revolutionary technology: an autonomous, closed-loop feedback system. DI Site Builder will generate an initial version of the code based on DI's established Building Blocks, deploy it to a local Docker environment, visually compare the preview against the Figma design, and then iteratively self-correct its own code until a pixel-perfect match is achieved.

This system will drastically reduce manual development time, eliminate human error in design translation, and enforce 100% compliance with DI's established coding and design standards. DI Site Builder will empower our developers by automating the most tedious parts of their workflow, allowing them to focus on building the complex, high-value features that define a Dealer Inspire website.

### 2. The Problem

The current Figma-to-code workflow for DI theme development is manual, time-consuming, and prone to inconsistency. DI Front-End Developers face several critical pain points:

- **Manual Translation:** Developers spend significant time manually interpreting Figma design specifications (spacing, colors, typography) and translating them into SCSS and PHP. This "pixel-pushing" is a low-value, high-effort task.
- **Cognitive Overhead:** Developers must constantly cross-reference the `_variables.scss` file (770+ lines) and the `DI_BUILDING_BLOCKS_CATALOG.md` to ensure they are using the correct variables and components, slowing down development and introducing the risk of deviation from standards.
- **Slow Feedback Loop:** The current refinement process involves a developer making a code change, waiting for the Gulp build process, refreshing their browser, and visually comparing the result to Figma. This cycle is repeated dozens of times for a single component, creating significant delays.
- **Inconsistent Quality:** The final quality of the code and its visual accuracy are highly dependent on the individual developer's experience and attention to detail, leading to variable outcomes.

### 3. Goals and Objectives

The primary goal of Project Phoenix is to **automate the creation of high-quality, production-ready DI theme components directly from Figma designs.**

| Goal                                | Measurable Objective (KPI)                                                                                                                   |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Increase Development Velocity**   | Reduce the end-to-end time to create a new theme component from Figma by **over 70%**.                                                       |
| **Improve Code Quality & Accuracy** | Automatically achieve **>99.5% visual accuracy** (via pixel comparison) between the final generated code and the Figma design.               |
| **Enforce Development Standards**   | Ensure **100% of generated code** adheres to DI standards (BEM, SCSS variables, PHP structure, ACF JSON format) without manual intervention. |
| **Enhance Developer Experience**    | Free up developers from tedious manual tasks to focus on complex functionality, performance optimization, and custom feature development.    |

### 4. Target Audience

- **Primary User:** **DI Front-End Developer**. This is the individual who will run the Phoenix CLI to generate and refine components for new or existing themes.
- **Secondary Stakeholders:**
  - **Project Managers:** Benefit from more predictable timelines and faster project completion.
  - **QA Engineers:** Receive components with higher initial visual fidelity, reducing the number of UI bugs.
  - **Designers:** Gain confidence that their Figma designs will be implemented with perfect accuracy.

### 5. Functional Requirements (Features)

Project Phoenix will be delivered as a Command-Line Interface (CLI) tool that orchestrates the entire feedback loop.

#### **Epic 1: Phoenix Command-Line Interface (CLI)**

The developer's primary interaction point with the system.

- **FR-1.1 `phoenix generate`:** The main command. Takes a Figma node URL and a target theme name as arguments. This command initiates the entire autonomous feedback loop.
- **FR-1.2 `phoenix config`:** A command to set up and validate necessary configurations, such as Figma API tokens, LLM API keys, and the path to the `di-websites-platform` directory.
- **FR-1.3 Interactive Logging:** The CLI must provide clear, step-by-step logging of the feedback loop's progress (e.g., "Phase 1: Generating initial code...", "Phase 3: Visual comparison score: 98.7%...", "Phase 4: Refining SCSS...").

#### **Epic 2: Figma Integration Module**

Handles all communication with the Figma API.

- **FR-2.1 Fetch Node Structure:** Must be able to retrieve the full JSON representation of a given Figma node, including its layers, properties, and content.
- **FR-2.2 Fetch Reference Image:** Must be able to export a high-fidelity PNG image of a given Figma node, with controllable scale and dimensions to match the local screenshot.

#### **Epic 3: AI Scaffolding Engine (Initial Generation)**

Responsible for creating the first draft of the code.

- **FR-3.1 Building Block Mapping:** Analyzes the Figma node's structure and identifies the most appropriate component from the `DI_BUILDING_BLOCKS_CATALOG.md`.
- **FR-3.2 ACF JSON Generation:** Generates a DI-compliant ACF JSON file based on the content (text, image placeholders) found in the Figma design and the fields required by the matched Building Block.
- **FR-3.3 PHP & SCSS Scaffolding:** Generates the necessary PHP (`get_template_part`) and SCSS (`@import`) includes in the theme's core files (`front-page.php`, `home.scss`), and creates the initial `_section-name.scss` file using the matched Building Block as a template.

#### **Epic 4: Local Environment Orchestrator**

Manages the local Dockerized WordPress environment.

- **FR-4.1 File Deployment:** Places the generated/refined files into the correct directories within the target child theme (`dealer-themes/[theme-name]/`).
- **FR-4.2 Build Trigger:** Programmatically executes the `gulp build` command (or equivalent) inside the Docker container to compile assets.
- **FR-4.3 Screenshot Capture:** Uses Playwright to navigate to `http://localhost:8080`, remove the WordPress admin bar, and capture a clean screenshot of the specific component being developed.

#### **Epic 5: Visual Comparison Engine**

Compares the local preview to the Figma source of truth.

- **FR-5.1 High-Speed Pixel Check:** Performs an initial, fast comparison using a pixel-matching library to check for convergence.
- **FR-5.2 AI Vision Analysis:** If the pixel check fails, it sends both the Figma image and the local screenshot to a multimodal AI to get a structured JSON report of all visual discrepancies (e.g., color, font-size, padding, alignment).

#### **Epic 6: AI Refinement Engine**

The core of the feedback loop; responsible for self-correction.

- **FR-6.1 Contextual Code Correction:** Takes the existing code, the visual difference report, and DI standards as context to generate a corrected version of the SCSS/PHP file.
- **FR-6.2 Loop Control:** Manages the refinement loop, terminating on success (convergence threshold met) or failure (max iterations reached).

### 6. User Flow

1.  A **DI Developer** identifies a section in Figma to be built (e.g., the hero section).
2.  The developer copies the Figma node URL for that section.
3.  In their terminal, the developer runs: `phoenix generate --url "https://figma.com/..." --theme "arriba-motors-v2"`
4.  **Phoenix (Phase 1):**
    - Connects to Figma, analyzes the node.
    - Identifies it as `hero-page-3` from the Building Blocks.
    - Generates `hero-section.php`, `_hero-section.scss`, and `group_...json`.
5.  **Phoenix (Phase 2):**
    - Places the files in the `di-websites-platform/dealer-themes/arriba-motors-v2/` directory.
    - Executes `docker-compose exec ... gulp build`.
    - Launches Playwright and takes a screenshot of the hero section on `localhost:8080`.
6.  **Phoenix (Phase 3):**
    - Downloads the reference image from Figma.
    - Performs a pixel comparison. Score is 97.2% (fail).
    - Sends both images to the AI Vision model, which returns a JSON report: `[{ "element": ".cta-button", "discrepancy": "color is #007BFF, should be #0069D9" }, ...]`
7.  **Phoenix (Phase 4):**
    - The AI Refinement Engine reads `_hero-section.scss` and the JSON report.
    - It corrects the SCSS, changing `background-color: $primary` to `background-color: $primaryhover` (assuming `$primaryhover` is `#0069D9`).
    - It overwrites the `_hero-section.scss` file.
8.  The loop **repeats** from Phase 2. This time, the visual comparison score is 99.9%.
9.  **Phoenix:** The CLI prints "✅ Convergence reached! Component 'hero-section' is complete." and terminates.

### 7. Non-Functional Requirements

- **Performance:** A single feedback loop iteration (build, capture, compare, refine) should take less than 90 seconds.
- **Reliability:** The system must achieve a >95% success rate (reaches convergence) on components based on the core Building Blocks library. It must handle API errors gracefully.
- **Security:** All API keys and sensitive credentials must be managed via environment variables or a secure local configuration, never hardcoded.
- **Maintainability:** The code for Phoenix must be well-documented. Key parameters (e.g., convergence threshold, API endpoints) must be configurable.

### 8. Out of Scope (Version 1.0)

- **No GUI:** This is a CLI-first tool for developers. A graphical user interface is not part of V1.
- **No JavaScript Generation:** The initial scope is limited to PHP (structure), SCSS (style), and ACF (content definition). JS generation is a V2 consideration.
- **No New Component Creation:** Phoenix is designed to work with the _existing_ DI Building Blocks system. It will not invent novel components or new design patterns.
- **No CI/CD Integration:** This tool is intended for local development. Integration into an automated deployment pipeline is a future enhancement.

### 9. Future Enhancements (Post V1.0)

- **JavaScript Generation:** Adding the ability to generate and refine JavaScript for interactive components.
- **Real-time Sync:** Investigating a "watch" mode that syncs changes from Figma to the local environment in near real-time.
- **Full Page Generation:** Expanding the capability from single components to scaffolding entire pages or even an entire theme.
- **CI/CD Pipeline Integration:** Creating a version that can run in a CI pipeline for automated visual regression testing.

### 10. References & Appendices

- DI Local Development Environment & Feedback Loop (`DI_LOCAL_DEV_ENVIRONMENT.md`)
- Dealer Inspire (DI) Standards Reference (`DI_STANDARDS_REFERENCE.md`)
- Dealer Inspire Building Blocks Catalog (`DI_BUILDING_BLOCKS_CATALOG.md`)
- Arriba Motors Figma Project (Design Source of Truth)
