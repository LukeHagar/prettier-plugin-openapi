# OpenAPI Key Ordering Reference

This document lists all OpenAPI keys supported by the Prettier OpenAPI plugin, their ordering, and the reasoning from the source code comments.

## Sorting Philosophy

The key ordering follows these general principles:

- **Short, important info first**: Keys like `name`, `title`, `version`, `description` that provide quick context are placed at the top
- **Logical grouping**: Related keys are grouped together (e.g., `type` and `format`, numeric constraints, string constraints)
- **Size-based ordering**: Shorter, simpler keys come before longer, more complex ones
- **Reference keys at top**: `$ref` and similar reference keys are always first when present
- **Core content in middle**: The main schema/content definitions are in the middle sections
- **Composition at bottom**: Complex composition keys like `allOf`, `anyOf`, `oneOf` are placed near the end
- **Examples follow content**: Example keys are placed directly after the content they exemplify

The overall philosophy is to make OpenAPI specifications more readable by placing the most important, frequently referenced and smallest information items at the top.

Things generally made up of other things in the middle.

And the most basic building blocks are generally at the bottom.

## Root Level Keys

1. **swagger** - version identifier
2. **openapi** - version identifier
3. **jsonSchemaDialect** - schema identifier
4. **info** - API information
5. **externalDocs** - External documentation links
6. **schemes** - server schemes (common sense grouping for server definition)
7. **host** - server host
8. **basePath** - server base path
9. **consumes** - content types (typically short arrays, grouped together higher up)
10. **produces** - content types (typically short arrays, grouped together higher up)
11. **servers** - server definitions (replaces host, basePath, schemes in 2.0). Usually really short, and can be helpful to see at the top for quick reference
12. **security** - Security requirements (tiny, keep it at the top)
13. **tags** - API tags (often fairly long, but given that it's a fairly core organizational feature, it's helpful to see at the top for quick reference)
14. **paths** - API paths (usually the longest block, unless components are used heavily, in which case it can be fairly short)
15. **webhooks** - webhooks (very often a short list, if included at all, but depending on API structure and usage it can be quite long, having it below paths but above components seems like good placement)
16. **components** - reusable components (replaces definitions, parameters, responses, securityDefinitions in 2.0). Usually the longest block when it's heavily used, due to it having sections for reuse in most all other sections
17. **definitions** - schema definitions
18. **parameters** - global parameters
19. **responses** - global responses
20. **securityDefinitions** - security definitions

## Info Section Keys

1. **title** - API title (just a name, usually a single short line)
2. **version** - API version (usually a tiny string, and should be at the top)
3. **summary** - API summary (shorter description, seems appropriate to have it above description)
4. **description** - API description (usually longer if included alongside a summary. I have seen everything from a single line to a veritable novel)
5. **termsOfService** - Terms of service (usually a single line, and should be at the top)
6. **contact** - Contact information (multi-line object when included, so it should be at the bottom)
7. **license** - License information (multi-line object when included, so it should be at the bottom)

## Contact Keys

1. **name** - Contact name
2. **email** - Contact email
3. **url** - Contact URL

*This key order should not require explanation. If it does let me know and I'll block you.*

## License Keys

1. **name** - License name
2. **identifier** - License identifier
3. **url** - License URL

## Components Section Keys

*A sane ordering for components.*

1. **securitySchemes** - Security schemes (almost always present, and very short, put it at the top)
2. **pathItems** - path items (I have never actually seen path items included in a specification. That being said, I think the general philosophy of larger items at the top, with smaller more atomic items used to make up the larger items at the bottom, makes sense)
3. **parameters** - Global parameters (can be larger, especially in larger APIs with extremely consistent usage patterns, but almost always shorter than schemas)
4. **headers** - Global headers (basically just more parameters)
5. **requestBodies** - Global request bodies (almost never used, I believe this is because the request bodies are usually so different from endpoint to endpoint. However, if they are used, specifying them at this level seems reasonable)
6. **responses** - Global responses (usually a smaller list, and often only used for global error responses)
7. **callbacks** - Global callbacks (essentially another kind of response)
8. **links** - Global links (programmatic ways to link endpoints together)
9. **schemas** - Global schemas (frequently the largest block, and are the building blocks that make up most every other section)
10. **examples** - Global examples (fairly free form, and logically would be used in schemas, so it makes sense to be at the bottom)

## Operation Keys

1. **summary** - Operation summary (important short info at a glance)
2. **operationId** - Operation ID (important short info at a glance)
3. **description** - Operation description (important short info at a glance)
4. **externalDocs** - external documentation (important short info at a glance)
5. **tags** - Operation tags (important short info at a glance)
6. **deprecated** - Deprecation flag (important short info at a glance)
7. **security** - Operation security (often short list, and is usually not included at the operation level)
8. **servers** - operation servers (often short list, and is usually not included at the operation level)
9. **consumes** - content types
10. **produces** - content types
11. **parameters** - Operation parameters (ideally added first via $ref, for situations like pagination, and then single endpoint specific parameters inline after)
12. **requestBody** - request body (going to be shorter than responses, unless the responses are all `$ref`s)
13. **responses** - Operation responses (come after the request because obviously)
14. **callbacks** - callbacks (essentially another kind of response)
15. **schemes** - schemes (should never have been included at this level, it's just silly, but if they are, put them at the bottom)

## Parameter Keys

1. **name** - Parameter name (important short info at a glance)
2. **description** - Parameter description (important short info at a glance)
3. **in** - Parameter location (important short info at a glance)
4. **required** - Required flag (important short info at a glance)
5. **deprecated** - Deprecation flag (important short info at a glance)
6. **allowEmptyValue** - Allow empty values (semantic formatting options for parameters)
7. **style** - Parameter style (semantic formatting options for parameters)
8. **explode** - Explode flag (semantic formatting options for parameters)
9. **allowReserved** - Allow reserved characters (semantic formatting options for parameters)
10. **schema** - Parameter schema (the core of the parameter, and specifies what the parameter actually is)
11. **content** - content (similar to schema, and is typically only used for more complex parameters)
12. **type** - parameter type (the most common schema keys, and should always be paired together)
13. **format** - parameter format (the most common schema keys, and should always be paired together)
14. **items** - array items (when type is array, items should be present)
15. **collectionFormat** - collection format (the array equivalent of format)
16. **default** - default value (the default value of the parameter when that parameter is not specified)
17. **minimum** - minimum value (numeric parameter constraints grouped together)
18. **exclusiveMinimum** - exclusive minimum (numeric parameter constraints grouped together)
19. **multipleOf** - multiple of (numeric parameter constraints grouped together)
20. **maximum** - maximum value (numeric parameter constraints grouped together)
21. **exclusiveMaximum** - exclusive maximum (numeric parameter constraints grouped together)
22. **pattern** - pattern (string parameter constraints)
23. **minLength** - minimum length (string parameter constraints)
24. **maxLength** - maximum length (string parameter constraints)
25. **minItems** - minimum items (array parameter constraints)
26. **maxItems** - maximum items (array parameter constraints)
27. **uniqueItems** - unique items (array parameter constraints)
28. **enum** - enum values (a strict list of allowed values for the parameter)
29. **example** - Parameter example (perfect directly below the schema)
30. **examples** - Parameter examples (perfect directly below the schema)

## Schema Keys

1. **$ref** - JSON Schema draft reference (should always be at the top, because when included there are at most 2 other keys that are present)
2. **$id** - JSON Schema draft ID (when included it's used as a kind of name, or an id if you will, and should be at the top)
3. **$schema** - JSON Schema draft schema (appears to be universally external links, so should be grouped)
4. **$vocabulary** - JSON Schema draft vocabulary (appears to be universally external links, so should be grouped)
5. **$anchor** - JSON Schema draft anchor (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
6. **$dynamicAnchor** - JSON Schema draft dynamic anchor (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
7. **$dynamicRef** - JSON Schema draft dynamic reference (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
8. **$comment** - JSON Schema draft comment (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
9. **$defs** - JSON Schema draft definitions (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
10. **$recursiveAnchor** - JSON Schema draft recursive anchor (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
11. **$recursiveRef** - JSON Schema draft recursive reference (I have no idea on the practical use of these keys, especially in this context, but someone using them would likely want them close to the top for reference)
12. **title** - Schema title (the info section of the schema)
13. **description** - Schema description (description and externalDocs logically come after the title, describing it in more and more detail)
14. **externalDocs** - Schema external documentation (description and externalDocs logically come after the title, describing it in more and more detail)
15. **deprecated** - Deprecation flag (a good at a glance key, and stays at the top)
16. **type** - Schema type (type and format should always be grouped together)
17. **format** - Schema format (type and format should always be grouped together)
18. **contentSchema** - JSON Schema draft content schema (content schema, media type, and encoding are all related to the content of the schema, and are similar to format. They should be grouped together)
19. **contentMediaType** - JSON Schema draft content media type (content schema, media type, and encoding are all related to the content of the schema, and are similar to format. They should be grouped together)
20. **contentEncoding** - JSON Schema draft content encoding (content schema, media type, and encoding are all related to the content of the schema, and are similar to format. They should be grouped together)
21. **nullable** - Nullable flag (like format, it specifies how the type can behave, and in more recent versions of OpenAPI it's directly included in the type field)
22. **const** - Constant value (enum and const are both static entries of allowed values for the schema. They should be grouped together)
23. **enum** - Enum values (enum and const are both static entries of allowed values for the schema. They should be grouped together)
24. **default** - Default value (the default value of the schema when that schema is not specified. Same as with parameters, but at the schema level)
25. **readOnly** - Read-only flag (readOnly and writeOnly are boolean flags and should be grouped together)
26. **writeOnly** - Write-only flag (readOnly and writeOnly are boolean flags and should be grouped together)
27. **example** - Schema example (examples when included should be directly below what they are examples of)
28. **examples** - Schema examples (examples when included should be directly below what they are examples of)
29. **minimum** - Minimum value (numeric constraints grouped together)
30. **exclusiveMinimum** - Exclusive minimum (numeric constraints grouped together)
31. **multipleOf** - Multiple of (numeric constraints grouped together)
32. **maximum** - Maximum value (numeric constraints grouped together)
33. **exclusiveMaximum** - Exclusive maximum (numeric constraints grouped together)
34. **pattern** - Pattern (string constraints grouped together)
35. **minLength** - Minimum length (string constraints grouped together)
36. **maxLength** - Maximum length (string constraints grouped together)
37. **uniqueItems** - Unique items (array constraints grouped together)
38. **minItems** - Minimum items (array constraints grouped together)
39. **maxItems** - Maximum items (array constraints grouped together)
40. **items** - Array items (array constraints grouped together)
41. **prefixItems** - JSON Schema draft prefix items (describes tuple like array behavior)
42. **contains** - JSON Schema draft contains (specifies a subschema that must be present in the array)
43. **minContains** - JSON Schema draft minimum contains (min and max contains specify the match occurrence constraints for the contains key)
44. **maxContains** - JSON Schema draft maximum contains (min and max contains specify the match occurrence constraints for the contains key)
45. **unevaluatedItems** - JSON Schema draft unevaluated items (after accounting for Items, prefixItems, and contains, unevaluatedItems specifies if additional items are allowed. This key is either a boolean or a subschema. Behaves the same as additionalProperties at the object level)
46. **minProperties** - Minimum properties (object constraints grouped together)
47. **maxProperties** - Maximum properties (object constraints grouped together)
48. **patternProperties** - Pattern properties (a way to specify a pattern and schemas for properties that match that pattern)
49. **additionalProperties** - Additional properties (a way to specify if additional properties are allowed and if so, how they are shaped)
50. **properties** - Object properties (the actual keys and schemas that make up the object)
51. **required** - Required properties (a list of those properties that are required to be present in the object)
52. **unevaluatedProperties** - JSON Schema draft unevaluated properties (specifies if additional properties are allowed after applying all other validation rules. This is more powerful than additionalProperties as it considers the effects of allOf, anyOf, oneOf, etc.)
53. **propertyNames** - JSON Schema draft property names (defines a schema that property names must conform to. This is useful for validating that all property keys follow a specific pattern or format)
54. **dependentRequired** - JSON Schema draft dependent required (specifies properties that become required when certain other properties are present. This allows for conditional requirements based on the presence of specific properties)
55. **dependentSchemas** - JSON Schema draft dependent schemas (defines schemas that apply when certain properties are present. This allows for conditional validation rules based on the presence of specific properties. For example, if a property is present, a certain other property must also be present, and match a certain schema)
56. **discriminator** - Discriminator (a way to specify a property that differentiates between different types of objects. This is useful for polymorphic schemas, and should go above the schema composition keys)
57. **allOf** - All of composition (allOf, anyOf, oneOf, and not are all used to compose schemas from other schemas. allOf is a logical AND)
58. **anyOf** - Any of composition (allOf, anyOf, oneOf, and not are all used to compose schemas from other schemas. anyOf is a logical OR)
59. **oneOf** - One of composition (allOf, anyOf, oneOf, and not are all used to compose schemas from other schemas. oneOf is a logical XOR)
60. **not** - Not composition (allOf, anyOf, oneOf, and not are all used to compose schemas from other schemas. not is a logical NOT)
61. **if** - JSON Schema draft conditional if (conditional keys grouped together)
62. **then** - JSON Schema draft conditional then (conditional keys grouped together)
63. **else** - JSON Schema draft conditional else (conditional keys grouped together)
64. **xml** - XML serialization (a way to specify the XML serialization of the schema. This is useful for APIs that need to support XML serialization)

## Response Keys

1. **description** - Response description (a good at a glance key, and stays at the top)
2. **headers** - Response headers (a common key, and should be at the top)
3. **schema** - response schema (the core shape of the response)
4. **content** - response content (the core shape of the response)
5. **examples** - response examples (examples are of the schema, and should be directly below the schema)
6. **links** - response links (programmatic ways to link responses together)

## Security Scheme Keys

1. **name** - Security scheme name (good at a glance keys)
2. **description** - Security scheme description (good at a glance keys)
3. **type** - Security scheme type (the primary type of this security scheme)
4. **in** - Security scheme location (the primary type of this security scheme)
5. **scheme** - Security scheme (the primary type of this security scheme)
6. **bearerFormat** - Bearer token format (if scheme is bearer, bearerFormat is the format of the bearer token. Should be directly below scheme)
7. **openIdConnectUrl** - OpenID Connect URL (if scheme is openIdConnect, openIdConnectUrl is the URL of the OpenID Connect server)
8. **flows** - OAuth flows (the different ways to authenticate with this security scheme)
9. **flow** - OAuth flow
10. **authorizationUrl** - authorization URL
11. **tokenUrl** - token URL
12. **scopes** - OAuth scopes

## OAuth Flow Keys

1. **authorizationUrl** - Authorization URL (where the client can get an authorization code)
2. **tokenUrl** - Token URL (where the client can get a token)
3. **refreshUrl** - Refresh URL (where the client can refresh a token)
4. **scopes** - OAuth scopes (the different scopes that can be used with this security scheme)

## Server Keys

1. **name** - server name (name first because obviously)
2. **description** - Server description (description so you know what you are looking at)
3. **url** - Server URL (the URL of the server)
4. **variables** - Server variables (the different variables that are present in the URL)

## Server Variable Keys

1. **description** - Variable description (description so you know what you are looking at)
2. **default** - Variable default value (the default value of the variable when that variable is not specified. IMO this should be optional, but I was not consulted)
3. **enum** - Variable enum values (a static list of allowed values for the variable)

## Tag Keys

1. **name** - Tag name (name first because obviously)
2. **description** - Tag description (description so you know what you are looking at)
3. **externalDocs** - Tag external documentation (external docs should be like an extension of the description)

## External Documentation Keys

*The only sane key order, fight me.*

1. **description** - External documentation description
2. **url** - External documentation URL

## Webhook Keys

*This seems like an obvious order given our running philosophy.*

1. **summary** - Webhook summary
2. **operationId** - Webhook operation ID
3. **description** - Webhook description
4. **deprecated** - Webhook deprecation flag
5. **tags** - Webhook tags
6. **security** - Webhook security
7. **servers** - Webhook servers
8. **parameters** - Webhook parameters
9. **requestBody** - Webhook request body
10. **responses** - Webhook responses
11. **callbacks** - Webhook callbacks

## Path Item Keys

*Short blocks at the top, long at the bottom.*

1. **$ref** - Path item reference
2. **summary** - Path item summary
3. **description** - Path item description
4. **servers** - Path item servers
5. **parameters** - Path item parameters
6. **get** - GET operation
7. **put** - PUT operation
8. **post** - POST operation
9. **patch** - PATCH operation
10. **delete** - DELETE operation
11. **options** - OPTIONS operation
12. **head** - HEAD operation
13. **trace** - TRACE operation

## Request Body Keys

*Simple/short first*

1. **description** - Request body description
2. **required** - Required flag
3. **content** - Request body content

## Media Type Keys

*These are a bit trickier, all seem rather long in context. I'll go with this order since it seems less to more complex.*

1. **schema** - Media type schema
2. **example** - Media type example
3. **examples** - Media type examples
4. **encoding** - Media type encoding

## Encoding Keys

1. **contentType** - Content type (just MIME type)
2. **style** - Encoding style (simple string or boolean values)
3. **explode** - Explode flag (simple string or boolean values)
4. **allowReserved** - Allow reserved characters (simple string or boolean values)
5. **headers** - Encoding headers (longer, put it at the bottom)

## Header Keys

1. **description** - Header description (a good at a glance key, and stays at the top)
2. **required** - Required flag
3. **deprecated** - Deprecation flag
4. **schema** - Header schema
5. **content** - Header content
6. **type** - Header type
7. **format** - Header format
8. **style** - Header style
9. **explode** - Explode flag
10. **enum** - Header enum values
11. **default** - Default value
12. **example** - Header example
13. **examples** - Header examples
14. **items** - Array items (array keys grouped together)
15. **collectionFormat** - Collection format (array keys grouped together)
16. **maxItems** - Maximum items (array constraints grouped together)
17. **minItems** - Minimum items (array constraints grouped together)
18. **uniqueItems** - Unique items (array constraints grouped together)
19. **minimum** - Minimum value (numeric constraints grouped together)
20. **multipleOf** - Multiple of (numeric constraints grouped together)
21. **exclusiveMinimum** - Exclusive minimum (numeric constraints grouped together)
22. **maximum** - Maximum value (numeric constraints grouped together)
23. **exclusiveMaximum** - Exclusive maximum (numeric constraints grouped together)
24. **pattern** - Pattern (string constraints grouped together)
25. **minLength** - Minimum length (string constraints grouped together)
26. **maxLength** - Maximum length (string constraints grouped together)

## Link Keys

1. **operationId** - Link operation ID
2. **description** - Link description
3. **server** - Link server
4. **operationRef** - Link operation reference
5. **parameters** - Link parameters
6. **requestBody** - Link request body

## Example Keys

1. **summary** - Example summary
2. **description** - Example description
3. **value** - Example value
4. **externalValue** - External example value

## Discriminator Keys

*Discriminator keys in preferred order (
1. **propertyName** - Discriminator property name
2. **mapping** - Discriminator mapping

## XML Keys

*XML keys in preferred order (
1. **name** - XML name
2. **namespace** - XML namespace
3. **prefix** - XML prefix
4. **attribute** - XML attribute flag
5. **wrapped** - XML wrapped flag
