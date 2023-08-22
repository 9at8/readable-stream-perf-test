import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server';

import * as path from 'path';

const base: Configuration = {
	target: ['web', 'es2022'],

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'out'),
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [{ loader: 'ts-loader' }],
			},
		],
	},

	resolve: {
		extensions: ['.ts', '.js'],
	},

	devtool: 'eval-source-map',

	infrastructureLogging: {
		level: 'log',
	},
};

const original: Configuration = {
	...base,

	name: 'original',

	entry: {
		original: './src/index.ts',
	},

	plugins: [new HtmlWebpackPlugin({ filename: 'original.html' })],
};

const modified: Configuration = {
	...base,

	name: 'modified',

	entry: {
		modified: './src/index.ts',
	},

	plugins: [new HtmlWebpackPlugin({ filename: 'modified.html' })],

	resolve: {
		alias: {
			process: '@9at8/process',
		},
	},
};

function output(
	env: Record<string, string>,
	argv: Record<string, string>,
): Configuration | Configuration[] {
	const configs = [original, modified];

	if (argv['mode'] === 'production') {
		return configs.map(config => ({
			...config,

			devtool: 'source-map',
		}));
	}

	switch (env['type']) {
		case 'original':
			return (
				configs.find(config => config.name === 'original') ??
				Throw(new Error('Original config not found'))
			);

		case 'modified':
			return (
				configs.find(config => config.name === 'modified') ??
				Throw(new Error('Modified config not found'))
			);

		default:
			throw new Error(`Invalid type ${env['type']}`);
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function Throw(error: Error): never {
	throw error;
}

export default output;
