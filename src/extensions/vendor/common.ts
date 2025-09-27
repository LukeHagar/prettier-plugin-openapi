import { defineConfig } from "../index.js";

// Function-based extensions with before/after helpers
export const common = defineConfig({
    info: {
        name: 'Common',
    },
    extensions: {
        'top-level': (before, after) => {
            return {
                'x-tagGroups': after('tags'),
            };
        },
        'operation': (before, after) => {
            return {
                'x-badges': after('tags'),
                'x-codeSamples': after('schemes'),
            };
        },
    }
});
