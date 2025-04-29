# Decision Log

This file records architectural and implementation decisions using a list format.
2025-04-28 11:23:00 - Log of updates made.
2025-04-28 11:39:45 - Added YAML validation strategy.
2025-04-29 10:46:00 - Added decision to include markdown files in package distribution.
2025-04-29 11:52:00 - Added decision to emphasize GitHub workflows for package publishing.

*

## Decision

* Emphasize GitHub workflows as the preferred method for package publishing
* Include markdown files from src/markdown/ in package distribution
* Maintain dual-format support (Markdown + YAML) for Jira management rules
* Implement schema validation for YAML configuration files
* Create backward compatibility layer for existing Markdown integrations

## Rationale

* GitHub workflows provide a more consistent and automated publishing process
* Eliminates the need for local npm authentication
* Creates an audit trail of all published versions
* Integrates with version control for better traceability
* Including markdown files in package distribution ensures server resources are correctly available
* Enhances the package's functionality by providing access to markdown guides
* Simplifies deployment by eliminating the need for separate resource files
* Dual formats allow gradual migration for existing users
* Schema validation ensures configuration integrity
* Backward compatibility preserves current workflows
* YAML provides machine-readable configuration
* Markdown remains human-friendly documentation

## Implementation Details

* Update publishing guide to emphasize GitHub workflows for package publishing
* Provide detailed instructions for setting up and using GitHub workflows
* Add copy-markdown script to package.json to copy markdown files to dist directory
* Update build script to include the copy-markdown step
* Ensure markdown files are included in the package files list
* Bump version to 1.2.0 following semantic versioning
* Update release notes with details of the changes
* Use JSON Schema for YAML validation
* Create adapter pattern for format translation
* Update CI/CD pipelines with format checks
* Document migration path in project guides