const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const images = require('@rollup/plugin-image');
const svg = require('rollup-plugin-svg');

module.exports = {
    rollup(config, options) {
        config.plugins = [
            replace({
                preventAssignment: true,
            }),
            postcss({
                modules: true,
                extract: true,
            }),
            images({ include: ['**/*.png', '**/*.jpg'] }),
            svg(),
            ...config.plugins
        ];
        return config;
    },
};
