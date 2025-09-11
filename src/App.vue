<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Copy, Pencil, Trash, X } from 'lucide-vue-next';

import { ClipMode } from '@/types/clipMode';
import type { ClipImage as ClipImageType } from '@/types/clipImage';

import { useExportClipImages } from '@/composables/export/exportClipImages';
import { useImportClipImages } from '@/composables/import/importClipImages';

import ClipImage from '@/components/clip-image/ClipImage.vue';
import EditClipImage from '@/components/clip-image/EditClipImage.vue';
import { Input } from '@/components/ui/input';
import SlidingToggleGroup from '@/components/ui/toggle-group/SlidingToggleGroup.vue';
import Button from '@/components/ui/button/Button.vue';
import SlidingToggleGroupItem from '@/components/ui/toggle-group/SlidingToggleGroupItem.vue';
import ToggleGroup from '@/components/ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '@/components/ui/toggle-group/ToggleGroupItem.vue';
import ClipImagePacks from './components/clip-image/ClipImagePacks.vue';

import 'vue-sonner/style.css';
import { Toaster } from '@/components/ui/sonner/';

const clipImages = ref<ClipImageType[]>([]);
const clipMode = ref<ClipMode>(ClipMode.COPY);
const searchClipImages = ref<string>();
const selectedClipImage = ref<ClipImageType | null>(null);
const exportFileInput = ref<HTMLInputElement>();

const { importClipImages, importClipImagesFromFile } = useImportClipImages(clipImages);
const { exportClipImages } = useExportClipImages();

onMounted(() => {
	const storedImages = localStorage.getItem('images');
	const hasVisited = localStorage.getItem('hasVisited');

	clipImages.value = storedImages ? JSON.parse(storedImages) : [];

	if (!storedImages && !hasVisited) {
		const packs = import.meta.glob('@/assets/packs/cats.json', { eager: true });
		const images = (Object.values(packs)[0] as { default: ClipImageType[] }).default || [];

		images.forEach((img) => {
			img.id = uuidv4();
		});

		importClipImages(images);
		localStorage.setItem('hasVisited', 'true');
	}
});

const filteredClipImages = computed(() => {
	const searchTerm = searchClipImages.value?.toLowerCase() || '';
	if (!searchTerm) return clipImages.value;

	return clipImages.value.filter((image) =>
		image.keywords.some((keyword) => keyword.toLowerCase().startsWith(searchTerm))
	);
});

function deleteClipImage(image: ClipImageType) {
	clipImages.value = clipImages.value.filter((img) => img.id !== image.id);
	localStorage.setItem('images', JSON.stringify(clipImages.value));
}
</script>

<template>
	<div class="p-4 md:p-8">
		<div
			class="flex gap-4 items-center bg-neutral-800 rounded-xl shadow-md p-4 mb-6 justify-center md:justify-between"
		>
			<div class="text-white text-2xl font-bold">Clipcord</div>
			<div class="relative w-full max-w-sm items-center hidden md:block">
				<Input
					v-model="searchClipImages"
					type="text"
					placeholder="Search..."
					class="pr-10"
				/>
				<span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
					<X
						@click="searchClipImages = ''"
						class="size-6 text-muted-foreground cursor-pointer"
					/>
				</span>
			</div>
		</div>

		<div class="grid xl:grid-cols-2 lg:grid-cols-1 lg:gap-4 gap-6">
			<div class="col-start-1 xl:col-span-2 bg-neutral-800 rounded-lg">
				<div class="flex xl:flex-row flex-col justify-between xl:items-center">
					<div class="p-4 xl:pr-0">
						<SlidingToggleGroup
							class="md:block hidden"
							v-model="clipMode"
							type="single"
						>
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.COPY"
								:value="ClipMode.COPY"
								aria-label="Copy mode"
							>
								<Copy /> Copy mode
							</SlidingToggleGroupItem>
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.EDIT"
								:value="ClipMode.EDIT"
								aria-label="Edit mode"
							>
								<Pencil /> Edit mode
							</SlidingToggleGroupItem>
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.DELETE"
								:value="ClipMode.DELETE"
								aria-label="Delete mode"
							>
								<Trash /> Delete mode
							</SlidingToggleGroupItem>
						</SlidingToggleGroup>

						<ToggleGroup
							class="md:hidden block w-full"
							v-model="clipMode"
							type="single"
						>
							<ToggleGroupItem
								class="w-full my-1"
								:disabled="clipMode === ClipMode.COPY"
								:value="ClipMode.COPY"
								aria-label="Copy mode"
							>
								<Copy /> Copy mode
							</ToggleGroupItem>
							<ToggleGroupItem
								class="w-full my-1"
								:disabled="clipMode === ClipMode.EDIT"
								:value="ClipMode.EDIT"
								aria-label="Edit mode"
							>
								<Pencil /> Edit mode
							</ToggleGroupItem>
							<ToggleGroupItem
								class="w-full my-1"
								:disabled="clipMode === ClipMode.DELETE"
								:value="ClipMode.DELETE"
								aria-label="Delete mode"
							>
								<Trash /> Delete mode
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
					<div
						class="p-4 xl:pl-0 pt-0 md:pt-4 flex gap-2 justify-center md:justify-normal"
					>
						<ClipImagePacks @import-clip-images="importClipImages" />
						<div>
							<Button variant="outline" @click="exportFileInput?.click()"
								>Import</Button
							>
							<input
								ref="exportFileInput"
								type="file"
								accept=".json"
								class="hidden"
								@change="importClipImagesFromFile"
							/>
						</div>
						<Button @click="exportClipImages(clipImages)" variant="outline"
							>Export</Button
						>
					</div>
				</div>
				<hr class="lg:block hidden" />
			</div>

			<div
				class="flex flex-col lg:col-start-3 justify-center p-4 bg-neutral-800 rounded-lg xl:w-150 xl:max-w-150 md:h-60 sm:h-auto"
			>
				<EditClipImage :clipImages :selectedClipImage :clipMode />
			</div>
		</div>

		<div class="p-4 bg-neutral-800 rounded-lg mt-6 block md:hidden">
			<div class="relative w-full items-center">
				<Input
					v-model="searchClipImages"
					type="text"
					placeholder="Search..."
					class="pr-10"
				/>
				<span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
					<X
						@click="searchClipImages = ''"
						class="size-6 text-muted-foreground cursor-pointer"
					/>
				</span>
			</div>
		</div>

		<div class="p-4 bg-neutral-800 rounded-lg mt-6">
			<div v-if="filteredClipImages.length > 0" class="flex flex-wrap gap-1">
				<ClipImage
					v-for="(image, index) in filteredClipImages"
					:key="index"
					:image
					:clipMode
					@select-clip-image="(img) => (selectedClipImage = img)"
					@delete-clip-image="deleteClipImage"
				/>
			</div>
			<div v-else>No images found</div>
		</div>
	</div>
	<Toaster theme="dark" />
</template>

<style scoped></style>
