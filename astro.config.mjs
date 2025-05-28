// @ts-check
import {defineConfig, passthroughImageService} from 'astro/config';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
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
                {label: '计算机网络', autogenerate: {directory: 'docs/计算机网络'}},
            ],
        }),

    ],
    image: {
        service: passthroughImageService(),
    },
});
