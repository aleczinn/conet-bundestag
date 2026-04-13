import { BASE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import { getLinks } from '@/lib/storyblok-queries';
import { DEFAULT_LOCALE } from '@/lib/locale/locales';

export const revalidate = 3600;

export async function GET() {
	const { data } = await getLinks(undefined, true);
	const links = Object.values(data.links ?? {})
		.filter((l: any) => !l.is_folder && !l.slug?.startsWith('config'))
		.map((l: any) => {
			const path = l.slug === 'home' ? '' : l.slug;
			return `- [${l.name}](${BASE_URL}/${DEFAULT_LOCALE.language}/${path})`;
		})
		.join('\n');

	const content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION ?? ''}

## Seiten

${links}

## Weitere Ressourcen

- [Sitemap](${BASE_URL}/sitemap.xml)
`;

	return new Response(content, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}