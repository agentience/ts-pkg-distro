# ADR-005: GraphQL Schema and DynamoDB Single-Table Design

## Status
Approved

## Date
April 22, 2025

## Context
The IFTI project is migrating from a QCubed application with a PostgreSQL database to an AWS Serverless architecture using AWS Amplify. A key architectural decision is how to design the GraphQL schema and underlying DynamoDB structure to ensure:

1. Efficient querying for all required access patterns
2. Support for organization-based multi-tenant data isolation
3. Proper authentication and authorization
4. Audit trail for all data changes
5. Performance at scale with potentially large datasets
6. Maintainability and developer productivity

The team has evaluated several approaches to DynamoDB modeling and GraphQL schema design, considering the trade-offs between performance, complexity, and maintainability.

## Decision
We will implement a GraphQL schema using AWS Amplify's @model, @auth, and @key directives to define our data models, access controls, and indexes. The schema will use a single-table DynamoDB design with carefully selected Global Secondary Indexes (GSIs) to support all required access patterns.

Key aspects of the design include:

1. **Organization-Based Data Isolation**:
   - All models include an `organizationId` field
   - Primary GSI on each model uses `organizationId` as partition key

2. **Access Pattern Optimization**:
   - Each model has 2-3 GSIs targeting specific access patterns
   - Composite sort keys for efficient filtering
   - Named query fields for generated resolvers

3. **Authentication and Authorization**:
   - Comprehensive @auth rules for each model
   - Role-based permissions aligned with business requirements
   - Owner-based access for user-specific data

4. **Audit Trail**:
   - All models include audit fields (createdBy, updatedBy, createdAt, updatedAt)

5. **Relationship Management**:
   - @connection directives to define relationships
   - Join tables for many-to-many relationships

The schema includes the following core models:
- Organization
- Client
- Project
- TestData
- Document
- User
- ProjectUser (join table)

Each model has optimized indexes using @key directives to support efficient querying for all identified access patterns.

## Consequences

### Positive
1. **Improved Query Performance**: The optimized indexes enable efficient querying for all identified access patterns without table scans.
2. **Simplified Development**: Amplify's abstractions reduce the complexity of working with DynamoDB's single-table design.
3. **Type Safety**: Generated TypeScript models provide type safety and IntelliSense support.
4. **Reduced Boilerplate**: Generated queries, mutations, and subscriptions reduce the amount of code to write and maintain.
5. **Flexible Authorization**: Fine-grained access control at the model and operation level.
6. **Future-Proofing**: The schema can evolve with additional access patterns by adding new indexes.

### Negative
1. **Learning Curve**: Team members will need to understand Amplify's abstractions and single-table design patterns.
2. **Index Management Overhead**: Multiple indexes require careful management and monitoring.
3. **Potential Performance Tuning**: Some complex queries may require custom resolvers or client-side processing.
4. **Write Amplification**: Multiple indexes increase the write cost and potentially impact write throughput.

### Mitigations
1. **Abstraction Layer**: Create a service layer to abstract index complexity from application code.
2. **Phased Implementation**: Start with critical indexes and add others as needed.
3. **Monitoring**: Implement CloudWatch metrics and alarms for early detection of performance issues.
4. **Custom Resolvers**: Implement custom resolvers for performance-critical operations.

## Alternatives Considered

### 1. Multiple DynamoDB Tables (One Per Entity)
- **Pros**: Simpler data model, more familiar to developers with relational database experience
- **Cons**: Less efficient for queries spanning multiple entity types, higher cost, more complex to manage relationships
- **Reason Not Selected**: Single-table design offers better performance and cost efficiency for our access patterns

### 2. AppSync Direct Lambda Resolvers
- **Pros**: Maximum flexibility for complex queries, custom business logic
- **Cons**: Higher development effort, more code to maintain, potential for inconsistent implementation
- **Reason Not Selected**: Amplify's generated resolvers cover most of our needs with less code and maintenance

### 3. Custom DynamoDB Access Layer Without Amplify
- **Pros**: Complete control over implementation, no abstraction limitations
- **Cons**: Significantly higher development effort, more complex to maintain
- **Reason Not Selected**: Amplify provides sufficient flexibility while reducing development time

## Implementation Plan

1. Deploy the schema to AWS AppSync using Amplify CLI
2. Generate TypeScript models and queries
3. Update service layer to use the generated models
4. Implement custom resolvers for complex queries as needed
5. Set up monitoring and alerting for performance metrics
6. Conduct performance testing with representative data volumes