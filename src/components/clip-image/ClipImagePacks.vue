<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import type { ClipImage } from '@/types/clipImage';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import ToggleGroup from '@/components/ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '@/components/ui/toggle-group/ToggleGroupItem.vue';
import { PackSelectMode } from '@/types/packSelectMode';

const emit = defineEmits<{
	(e: 'importClipImages', images: ClipImage[]): void;
}>();

const isOpen = ref(false);

const packFiles = import.meta.glob('@/assets/packs/*.json');
const packs = ref<Record<string, ClipImage[]>>({});
const selectedPack = ref<string>('cats');
const packsLoaded = ref(false);
const currentPackImages = computed(() => packs.value[selectedPack.value] || []);

const selectedClipImages = ref<ClipImage[]>([]);

const scrollContainer = ref<HTMLElement>();

const selectedFromCurrentPack = computed(() =>
	selectedClipImages.value.filter((selectedImg) =>
		currentPackImages.value.some((packImg) => packImg.id === selectedImg.id)
	)
);

const isCurrentPackFullySelected = computed(
	() =>
		currentPackImages.value.length > 0 &&
		selectedFromCurrentPack.value.length === currentPackImages.value.length
);

const selectMode = computed(() =>
	isCurrentPackFullySelected.value ? PackSelectMode.DESELECT : PackSelectMode.SELECT_ALL
);

function isImageSelected(img: ClipImage) {
	return selectedClipImages.value.some((selectedImg) => selectedImg.id === img.id);
}

function selectClipImage(img: ClipImage) {
	if (isImageSelected(img)) {
		selectedClipImages.value = selectedClipImages.value.filter((i) => i.id !== img.id);
	} else {
		selectedClipImages.value.push(img);
	}
}

function selectAllToggle() {
	if (isCurrentPackFullySelected.value) {
		// Deselect all images from current pack
		selectedClipImages.value = selectedClipImages.value.filter(
			(selectedImg) =>
				!currentPackImages.value.some((packImg) => packImg.id === selectedImg.id)
		);
	} else {
		// Select all unselected images from current pack
		const unselectedImages = currentPackImages.value.filter(
			(packImg) => !isImageSelected(packImg)
		);
		selectedClipImages.value.push(...unselectedImages);
	}
}

function importClipImages() {
	emit('importClipImages', selectedClipImages.value);
	selectedClipImages.value = [];
}

watch(isOpen, async (open) => {
	if (open && !packsLoaded.value) {
		for (const path in packFiles) {
			const packName = path.split('/').pop()?.replace('.json', '') || 'unknown';
			const mod = (await packFiles[path]()) as { default: Omit<ClipImage, 'id'>[] };

			packs.value[packName] = mod.default.map((img) => ({
				id: uuidv4(),
				...img,
			}));
		}

		packsLoaded.value = true;
	}
});

watch(selectedPack, () => {
	if (scrollContainer.value) {
		scrollContainer.value.scrollTop = 0;
	}
});
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button variant="outline">Packs</Button>
		</DialogTrigger>
		<DialogContent
			class="sm:max-w-[425px] md:max-w-[80vw] grid-rows-[auto_minmax(0,1fr)_auto] p-0 h-[90dvh]"
		>
			<DialogHeader class="p-6 pb-0">
				<div class="flex justify-between">
					<div>
						<DialogTitle>Packs</DialogTitle>
						<DialogDescription
							>Add clip images from packs to your library</DialogDescription
						>
					</div>
					<Button
						@click="selectAllToggle"
						class="capitalize w-24 mr-8"
						variant="outline"
						>{{ selectMode }}</Button
					>
				</div>
			</DialogHeader>

			<div class="flex gap-4 px-6 min-h-0">
				<div class="flex-shrink-0">
					<ToggleGroup
						v-model="selectedPack"
						class="flex-col gap-2 max-h-fit sticky top-0"
						type="single"
					>
						<ToggleGroupItem
							v-for="(clipImages, packName) in packs"
							:disabled="selectedPack === packName"
							:value="packName"
							class="w-full justify-normal"
						>
							{{ packName.replace(/_/g, ' ') }}
							<span class="text-gray-500">({{ clipImages.length }})</span>
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<div ref="scrollContainer" class="w-full overflow-y-auto">
					<div v-if="!packsLoaded" class="text-gray-500">Loading packs...</div>
					<div v-else>
						<div :key="selectedPack.toString()" class="space-y-4">
							<div class="flex flex-wrap gap-1">
								<img
									v-for="img in currentPackImages"
									@click="selectClipImage(img)"
									:key="img.id"
									:src="img.src"
									class="w-18 h-18 p-2 object-contain rounded cursor-pointer hover:scale-105 transition"
									:class="{
										'bg-violet-500/25 border-2 border-violet-500/25':
											isImageSelected(img),
									}"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<DialogFooter class="p-6 pt-0">
				<DialogClose as-child>
					<Button
						@click="importClipImages"
						:disabled="selectedClipImages.length === 0"
						type="submit"
						>Import ({{ selectedClipImages.length }})</Button
					>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
