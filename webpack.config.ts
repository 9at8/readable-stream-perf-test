import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server';

import * as path from 'path';

const base: Configuration = {
	target: ['web', 'es2022'],

	entry: {
		main: './src/index.ts',
		iframe: './src/iframe/index.ts',
		worker: './src/Worker.ts',
	},

	output: {
		filename: '[name].js',
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

	output: {
		...base.output,
		path: path.resolve(__dirname, 'out', 'original'),
	},

	plugins: [new HtmlWebpackPlugin({ chunks: ['main'], title: 'Original' })],
};

const modified: Configuration = {
	...base,

	name: 'modified',

	output: {
		...base.output,
		path: path.resolve(__dirname, 'out', 'modified'),
	},

	plugins: [new HtmlWebpackPlugin({ chunks: ['main'], title: 'Modified' })],

	resolve: {
		...base.resolve,

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
