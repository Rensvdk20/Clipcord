import { type Ref } from 'vue';
import type { ClipImage } from '@/types/clipImage';
import { v4 as uuidv4 } from 'uuid';

export function useImportClipImages(clipImages: Ref<ClipImage[]>) {
	const importClipImages = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedClipImages = JSON.parse(e.target?.result as string);
				const newClipImages = importedClipImages.map((img: Omit<ClipImage, 'id'>) => ({
					id: uuidv4(),
					...img,
				}));

				clipImages.value = [...clipImages.value, ...newClipImages];
				localStorage.setItem('images', JSON.stringify(clipImages.value));
			} catch (error) {
				console.error('Failed to import images:', error);
			}
		};
		reader.readAsText(file);
	};

	return {
		importClipImages,
	};
}
