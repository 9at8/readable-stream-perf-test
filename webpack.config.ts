import * as path from 'path';
import { Configuration } from 'webpack';

const base: Configuration = {
	mode: 'none',

	resolve: {
		extensions: ['.ts', '.js'],
	},

	devtool: 'nosources-source-map',

	infrastructureLogging: {
		level: 'log',
	},

	stats: 'minimal',

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
};

const extensionConfig: Configuration = {
	...base,
	target: 'node',

	entry: {
		extension: './src/extension/main.ts',
	},

	output: {
		...base.output,

		library: {
			type: 'commonjs2',
		},
	},

	externals: {
		vscode: 'commonjs vscode',
	},
};

const webviewConfig: Configuration = {
	...base,

	target: ['web', 'es2022'],

	entry: {
		webview: './src/webview/main.ts',
	},

	resolve: {
		...base.resolve,

		alias: {
			process: '@9at8/process'
		}
	}
};

export default [extensionConfig, webviewConfig];
