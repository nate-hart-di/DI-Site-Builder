# Cursor Rules Directory

This directory contains global development rules that are automatically loaded and applied to all AI coding assistant interactions.

## Rule Files

### Core Rules

- `prp-standard.mdc` - **PRIMARY**: Mandates use of PRP template for all requirements documentation
- `di-development-standards.mdc` - PHP/SCSS coding standards and best practices _(to be added)_
- `di-repo-structure.mdc` - Repository organization and theme structure _(to be added)_
- `di-theme-customization.mdc` - Header systems and CSS architecture _(to be added)_

## Rule Priority System

1. **ABSOLUTE PRIORITY**: PRP Standard - All requirements work must use `initial-documentation/PRP-Prompt.md`
2. **HIGH PRIORITY**: Development Standards - Code quality and consistency
3. **MEDIUM PRIORITY**: Repository Structure - File organization and naming
4. **CONTEXT PRIORITY**: Theme Customization - Component-specific guidelines

## Integration with PRP Template

The PRP template at `initial-documentation/PRP-Prompt.md` serves as the foundation for all feature specification work. When combined with these rules:

- **Consistency**: All specifications follow the same comprehensive format
- **Integration**: Requirements always reference existing codebase patterns
- **Quality**: Built-in validation gates and testing checkpoints
- **Maintainability**: Clear implementation guidance and architectural alignment

## Usage

These rules are automatically loaded at the start of every AI coding session. They ensure:

- Consistent development practices across all work
- Proper integration with existing Dealer Inspire platform standards
- Comprehensive requirements documentation using the PRP template
- Adherence to established patterns and conventions

## Rule Development

When adding new rules:

1. Use `.mdc` extension for rule files
2. Include clear enforcement priorities
3. Reference integration points with existing rules
4. Provide specific examples and non-negotiable standards
5. Update this README with new rule descriptions
