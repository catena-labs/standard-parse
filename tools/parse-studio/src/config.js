/**
 * Standard Schema Spec & Parse Engine Configuration
 */

export const PARSE_CONFIG = {
  spec: {
    name: 'Standard Schema Spec v1',
    url: 'https://github.com/standard-schema/standard-schema',
    description: 'Universal JavaScript / TypeScript schema validation interface supporting Zod, Valibot, and ArkType.',
  },
  supportedEngines: [
    { name: 'Standard-Parse (Catena)', speed: 'Zero-overhead Direct Validator', status: 'RECOMMENDED' },
    { name: 'Zod v3', speed: '~1.8 µs / parse', status: 'COMPATIBLE' },
    { name: 'Valibot v0.4', speed: '~0.6 µs / parse', status: 'COMPATIBLE' },
    { name: 'ArkType v2', speed: '~0.4 µs / parse', status: 'COMPATIBLE' },
  ],
  sampleSchemas: [
    {
      id: 'schema_ai_agent_payment',
      name: 'AgentFi Payment Intent Schema',
      jsonSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string', pattern: '^agent_[a-z0-9]+$' },
          amountUsdc: { type: 'number', minimum: 0.01 },
          destination: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
        },
        required: ['agentId', 'amountUsdc', 'destination'],
      },
    },
    {
      id: 'schema_verifiable_credential',
      name: 'W3C Verifiable Credential Schema',
      jsonSchema: {
        type: 'object',
        properties: {
          issuer: { type: 'string', pattern: '^did:' },
          issuanceDate: { type: 'string' },
          credentialSubject: { type: 'object' },
        },
        required: ['issuer', 'issuanceDate', 'credentialSubject'],
      },
    },
  ],
};
