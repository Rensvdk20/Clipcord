import { type Ref } from 'vue';
import type { ClipImage } from '@/types/clipImage';
import { v4 as uuidv4 } from 'uuid';

export function useImportClipImages(clipImages: Ref<ClipImage[]>) {
	function importClipImagesFromFile(event: Event) {
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
	}

	function importClipImages(newImages: ClipImage[]) {
		if (newImages.length === 0) return;

		clipImages.value = [...clipImages.value, ...newImages];
		localStorage.setItem('images', JSON.stringify(clipImages.value));
	}

	return {
		importClipImagesFromFile,
		importClipImages,
	};
}
