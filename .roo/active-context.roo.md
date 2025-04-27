# IFTI Project Active Context

## Current Work Focus

We are currently in Week 2 of Core Development, focusing on GraphQL API Design & DynamoDB Modeling.

### Recently Completed
- ✅ Defined GraphQL schema with authentication directives
- ✅ Designed single-table DynamoDB structure with optimized indexes
- ✅ Created ADR-005 documenting GraphQL schema and DynamoDB design decisions
- ✅ Documented implementation guide for the finalized schema

### In Progress
- 🔄 Configure Amplify DataStore
- 🔄 Set up monitoring and logging
- 🔄 Create application-level RBAC structure in Cognito
- 🔄 Begin implementing custom resolvers

## Implementation Progress

### Week 1: Amplify Infrastructure Foundation
- ✅ Set up AWS development accounts and environments
- ✅ Initialize Amplify project and configure environments
- ✅ Configure authentication with Cognito via Amplify Auth
- ✅ Set up Amplify hosting and CI/CD pipeline
- ✅ Define security policies and roles
- ✅ Initial GraphQL schema design

### Week 2: GraphQL API Design & DynamoDB Modeling
- ✅ Define GraphQL schema with authentication directives
- ✅ Design single-table DynamoDB structure
- 🔲 Configure Amplify DataStore
- 🔲 Set up monitoring and logging
- 🔲 Create application-level RBAC structure in Cognito
- 🔲 Begin implementing custom resolvers

## Revised Roadmap

| Week | Focus Area | Progress |
|------|------------|----------|
| Week 1 | Amplify Infrastructure Foundation | 100% |
| Week 2 | GraphQL API Design & DynamoDB Modeling | 50% |
| Week 3 | Core GraphQL Resolvers & Frontend Foundation | 0% |
| Week 4 | GraphQL Enhancement & Frontend Progress | 0% |
| Week 5 | GraphQL API Completion & Data Migration Planning | 0% |
| Week 6 | Frontend Focus & Migration Start | 0% |
| Week 7 | Amplify Frontend Refinement & Migration Progress | 0% |
| Week 8 | Final Integration & Migration Completion | 0% |
| Week 9 | Comprehensive Testing | 0% |
| Week 10 | Deployment & Cutover | 0% |

## Active Decisions

### Recently Made Decisions
1. **GraphQL Schema Design**: Finalized GraphQL schema using Amplify's @model, @auth, and @key directives to define data models, access controls, and indexes.
2. **DynamoDB Single-Table Design**: Adopted a single-table design with carefully selected GSIs to support all required access patterns.
3. **Index Optimization Strategy**: Each model has 2-3 GSIs targeting specific access patterns with composite sort keys for efficient filtering.
4. **Authentication Approach**: Implemented comprehensive @auth rules for each model with role-based permissions aligned with business requirements.
5. **Organization-Based Data Isolation**: All models include an organizationId field with primary GSI using organizationId as partition key.

### Pending Decisions
1. **Custom Resolver Implementation**: Need to decide which complex queries require custom resolvers.
2. **Monitoring Strategy**: Need to define CloudWatch metrics and alarms for performance monitoring.
3. **Data Migration Approach**: Need to finalize the strategy for migrating data from PostgreSQL to DynamoDB.

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| DynamoDB performance issues with large datasets | High | Medium | Implement optimized indexes, monitoring, and pagination strategies |
| Complex queries not efficiently handled by generated resolvers | Medium | Medium | Implement custom resolvers for performance-critical operations |
| Team unfamiliarity with single-table design | Medium | High | Provide training, documentation, and abstraction layer |
| Write amplification due to multiple indexes | Medium | Medium | Monitor write capacity, optimize write operations |
| Data migration complexity | High | High | Develop phased migration approach, thorough testing |

## Open Questions

1. How will we handle complex search functionality that might require full-text search capabilities?
2. What is the strategy for handling schema evolution as requirements change?
3. How will we implement real-time updates using GraphQL subscriptions?
4. What is the approach for handling large binary files (e.g., high-resolution images)?
5. How will we implement batch operations for efficiency?