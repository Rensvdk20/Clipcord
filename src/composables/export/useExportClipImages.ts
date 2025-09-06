import type { ClipImage } from '@/types/clipImage';

function useExportToJson<T>(data: T, filename: string): void {
	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function useExportClipImages(images: ClipImage[]): void {
	const imagesWithoutId = images.map(({ id, ...rest }) => rest);
	useExportToJson(imagesWithoutId, 'clipcord-export.json');
}
