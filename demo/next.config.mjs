/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const nextConfig = {
  transpilePackages: ['google-translate-picker-react'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react$': require.resolve('lucide-react'),
      'react$': require.resolve('react'),
      'react-dom$': require.resolve('react-dom'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };
    return config;
  },
};

export default nextConfig;
