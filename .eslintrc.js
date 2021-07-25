module.exports = {
	'env': {
		'commonjs': true,
		'node': true,
		'es6': true,
        'mocha': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true,
            'modules': true
        }
	},
	'rules': {
		'semi': ['error', 'always'],
		'quotes': ['error', 'single'],
		'no-undef': 'error',
		'no-unused-vars': 'off'
	}
};