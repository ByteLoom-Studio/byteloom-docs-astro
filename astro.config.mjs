// @ts-check
import {defineConfig, passthroughImageService} from 'astro/config';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss(),],
        resolve: {
            alias: {
                '@/': path.resolve(__dirname, './'),
                '@src': path.resolve(__dirname, './src/'),
                '@assets': path.resolve(__dirname, './src/assets'),
                '@components': path.resolve(__dirname, './src/components'),
            },
        },

    },
    integrations: [
        starlight({
            customCss: ['./src/styles/global.css'],
            plugins: [
                catppuccin({
                    dark: {flavor: 'frappe', accent: 'lavender'},
                    light: {flavor: 'latte', accent: 'lavender'},
                }),
            ],
            title: {
                en: 'ByteLoom Studio',
                'zh-CN': 'ByteLoom Studio',
            },

            defaultLocale: 'root',
            locales: {
                root: {
                    label: '简体中文',
                    lang: 'zh-CN', // lang is required for root locales
                },
                // English docs in `src/content/docs/en/`
                en: {
                    label: 'English',
                },
                // Simplified Chinese docs in `src/content/docs/zh-CN/`
                ja: {
                    label: '日本語',
                    lang: 'ja-JP',
                },
                'ko': {
                    label: '한국어',
                    lang: 'ko-KR',
                },

            },
            social: [{icon: 'github', label: 'GitHub', href: 'https://github.com/ByteLoom-Studio'}],
            sidebar: [
                {label: '文档', autogenerate: {directory: 'docs'}},
            ],
        }),

    ],
    image: {
        service: passthroughImageService(),
        remotePatterns: [{protocol: "https"}],
    },
});
