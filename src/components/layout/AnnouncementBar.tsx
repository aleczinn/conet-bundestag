import Container from '@/components/layout/Container';
import { renderRichText } from '@storyblok/react';

export type AnnouncementBarItem = {
	_uid: string;
	enabled: boolean;
	type: string;
	message: any;
	start_date: string;
	end_date: string;
}

interface AnnouncementBarProps {
	items: AnnouncementBarItem[];
}

function getActiveAnnouncementBar(items: AnnouncementBarItem[]): AnnouncementBarItem | null {
	if (!items?.length) {
		return null;
	}

	const now = new Date();

	return items.find((item) => {
		if (!item.enabled) {
			return false;
		}
		if (item.start_date && new Date(item.start_date) > now) {
			return false;
		}
		return !(item.end_date && new Date(item.end_date) < now);
	}) ?? null;
}

export default function AnnouncementBar({ items }: AnnouncementBarProps) {
	const bar = getActiveAnnouncementBar(items);

	if (!bar) {
		return;
	}

	const colors = {
		info: "bg-[#002C5C] text-gray-10",
		warning: "bg-[#002C5C] text-gray-90",
	};

	return (
		<Container className={`w-full py-2 text-center ${colors[bar.type]}`}>
			<span dangerouslySetInnerHTML={{ __html: renderRichText(bar.message) }} />
		</Container>
	)
}