# System Patterns: QCubed to AWS Serverless Migration

## Current System Architecture

The existing QCubed application follows several architectural patterns:

### 1. MVC-like Architecture

Although QCubed doesn't strictly follow the Model-View-Controller pattern, it implements a similar separation:
- **Models**: Auto-generated classes from database tables (e.g., `ProjectDataGen`)
- **Views**: Combination of PHP templates (`.tpl.php` files) and HTML
- **Controllers**: PHP code in form classes handling user interaction

### 2. Active Record Pattern

The QCubed ORM implements an active record pattern where:
- Each database table has a corresponding model class
- Model instances represent rows in the database
- Models contain both data access and domain logic

### 3. Form-based Interface Pattern

The UI is primarily built around forms that:
- Handle both display (HTML generation) and processing
- Manage state between requests
- Include validation and business rule enforcement

### 4. Code Generation Pattern

QCubed heavily relies on code generation:
- Base classes are auto-generated from database schema
- Custom logic is added through class inheritance
- Changes to database structure drive regeneration of base classes

### 5. Workflow State Machine

The application implements a workflow pattern for projects:
- Projects progress through defined states (statuses)
- Different user roles interact with projects at different states
- State transitions trigger various business processes

## Target AWS Serverless Architecture with Amplify

The proposed AWS serverless architecture will be implemented using AWS Amplify as the primary development framework and will incorporate these key patterns:

### 1. Microservices Architecture

The new system will adopt a domain-driven microservices approach:
- **Domain Segmentation**: Services organized by business domain
- **Service Independence**: Each service can be developed, deployed, and scaled independently
- **Right-sized Services**: Functions grouped by domain responsibility

```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Project Domain   │  │  Testing Domain   │  │  Reporting Domain │
│                   │  │                   │  │                   │
│  - Project CRUD   │  │  - Test Data CRUD │  │  - Report Gen     │
│  - Project Status │  │  - Test Analysis  │  │  - PDF Creation   │
│  - Client Mgmt    │  │  - Equipment Mgmt │  │  - Data Export    │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

### 2. GraphQL API Pattern with Amplify

All functionality will be exposed through a well-defined GraphQL API:
- **GraphQL Schema**: Strongly typed schema for all data operations
- **AppSync**: Managed GraphQL service with real-time capabilities
- **Resolvers**: Custom resolvers for complex operations
- **API Documentation**: Auto-generated documentation from GraphQL schema
- **Versioning Strategy**: Type extensions and deprecation for schema evolution

### 3. Event-Driven Architecture

Event-driven patterns will enable loose coupling:
- **Asynchronous Processing**: Events trigger serverless functions
- **Event Bus**: EventBridge to route and filter events
- **Event Sourcing**: Capture state changes as events where appropriate
- **Pub/Sub Model**: Components communicate through events

### 4. Single-Table DynamoDB Pattern

Moving from relational to NoSQL requires a shift in data modeling:
- **Access Pattern Driven**: Design based on query patterns, not entity relationships
- **Composite Keys**: Complex keys to enable flexible querying
- **Denormalization**: Strategic data duplication to optimize reads
- **Secondary Indexes**: GSIs/LSIs for additional access patterns

### 5. React Frontend with Amplify Components

The frontend will follow modern React patterns enhanced by Amplify:
- **Static Generation**: Pre-built static assets deployed to CDN
- **React SPA**: Single-page application built with React
- **Amplify UI**: Leveraging Amplify UI components and hooks
- **Generated API Layer**: Auto-generated API clients from GraphQL schema
- **Domain-Focused Components**: Organized by business domain

### 6. Serverless Workflow Orchestration

Complex workflows will be handled using:
- **Step Functions**: Visual workflow definition for complex processes
- **State Machines**: Explicit state management for business processes
- **Error Handling**: Comprehensive retry and error management
- **Human-in-the-Loop**: Support for human approval steps where needed

### 7. Application-Level Role-Based Access Control

Access control will be implemented using a multi-layered approach:
- **Cognito Groups**: Store role membership in Cognito user groups
- **GraphQL Directives**: Access control rules in the GraphQL schema
- **Custom Resolvers**: Role-based filtering in data access
- **UI Authorization**: Component rendering based on user roles
- **Organization Isolation**: Multi-tenant data separation

## Key Architecture Patterns Comparison

| Pattern Area | Current QCubed System | AWS Serverless Target with Amplify |
|--------------|----------------------|------------------------|
| **Deployment Model** | Monolithic application | Microservices with Amplify-managed deployment |
| **Scaling Approach** | Vertical scaling of servers | Automatic scaling of individual functions |
| **Data Access** | ORM with SQL queries | GraphQL API with custom resolvers |
| **State Management** | Server-side session state | Client state management with hooks |
| **UI Architecture** | Server-rendered pages with jQuery | React SPA with Amplify components |
| **Integration Model** | Tight coupling between components | GraphQL API with event-driven patterns |
| **Authentication** | PHP session-based authentication | Cognito with Amplify Auth |
| **Workflow Implementation** | Database status fields with code logic | Explicit Step Functions workflows |
| **Access Control** | Database-level permissions | Multi-layered RBAC with Cognito groups |

## Component Relationships

### Current System

```
┌─────────────┐     ┌────────────┐     ┌─────────────┐
│             │     │            │     │             │
│   Browser   │◄────┤   QCubed   │◄────┤    MySQL    │
│   Client    │     │ Application│     │  Database   │
│             │     │            │     │             │
└─────────────┘     └────────────┘     └─────────────┘
                          │
                          ▼
                    ┌────────────┐
                    │  File      │
                    │  Storage   │
                    │            │
                    └────────────┘
```

### Target System with Amplify

```
┌─────────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │            │     │             │     │             │
│   Browser   │◄────┤ CloudFront │◄────┤  S3 Bucket  │     │  Cognito    │
│   Client    │     │    CDN     │     │  (Static)   │     │ User Pools  │
│             │     │            │     │             │     │ (with RBAC) │
└─────────────┘     └────────────┘     └─────────────┘     └─────────────┘
       │                                                          ▲
       │                                                          │
       ▼                                                          │
┌─────────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │            │     │             │     │             │
│ Amplify React◄────┤  AppSync   │◄────┤   Lambda    │◄────┤  DynamoDB   │
│  Application│     │  GraphQL   │     │  Functions  │     │ Single-Table│
│             │     │            │     │             │     │             │
└─────────────┘     └────────────┘     └─────────────┘     └─────────────┘
                                             │                    │
                          ┌─────────────────┬┴──────────────┐     │
                          ▼                 ▼               ▼     │
                    ┌────────────┐    ┌────────────┐ ┌────────────┐
                    │    S3      │    │    Step    │ │EventBridge │
                    │  Storage   │    │  Functions │ │            │
                    │            │    │            │ │            │
                    └────────────┘    └────────────┘ └────────────┘
                                                            │
                                                            ▼
                                                     ┌────────────┐
                                                     │ OpenSearch │
                                                     │ Serverless │
                                                     │ (Future)   │
                                                     └────────────┘
```

## Implementation Principles

1. **Separation of Concerns**
   - Clear boundaries between domains
   - Distinct services for different responsibilities
   - GraphQL schema organized by domain

2. **Infrastructure as Code with Amplify**
   - Amplify CLI for infrastructure provisioning
   - CloudFormation templates generated by Amplify
   - Version-controlled infrastructure configuration

3. **DevOps Automation**
   - CI/CD pipelines for all components
   - Automated testing at multiple levels
   - Blue/green deployments

4. **Security by Design**
   - Least privilege principle for all components
   - Encryption in transit and at rest
   - Fine-grained permission model

5. **Resilience Patterns**
   - Circuit breakers for external dependencies
   - Retry with exponential backoff
   - Graceful degradation
   - Error handling at all levels

6. **Observability**
   - Comprehensive logging strategy
   - Metrics collection for all components
   - Distributed tracing with X-Ray
   - Amplify Console monitoring

7. **Phased Approach to Advanced Capabilities**
   - Start with DynamoDB single-table design
   - Add OpenSearch Serverless when advanced search is needed
   - Evolutionary approach to feature implementation
   - Cost-effective resource utilization

8. **Security by Layers**
   - Organization-level data isolation
   - Role-based access control in GraphQL schema
   - Field-level security with GraphQL directives
   - Application-level authorization checks
