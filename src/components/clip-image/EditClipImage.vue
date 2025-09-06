<script lang="ts" setup>
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import type { ClipImage } from '@/types/clipImage';
import { ClipMode } from '@/types/clipMode';

import {
	TagsInput,
	TagsInputInput,
	TagsInputItem,
	TagsInputItemDelete,
	TagsInputItemText,
} from '@/components/ui/tags-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const props = defineProps<{
	clipImages: ClipImage[];
	selectedClipImage: ClipImage | null;
	clipMode: ClipMode;
}>();

const emit = defineEmits<{
	(e: 'update:clipImages', value: ClipImage[]): void;
}>();

const imageSrc = ref('');
const keywords = ref<string[]>([]);

watch(
	() => props.clipMode,
	(newClipMode) => {
		if (newClipMode !== ClipMode.EDIT) {
			imageSrc.value = '';
			keywords.value = [];
		}
	}
);

watch(
	() => props.selectedClipImage,
	(newSelectedClipImage) => {
		if (newSelectedClipImage && props.clipMode === ClipMode.EDIT) {
			imageSrc.value = newSelectedClipImage.src;
			keywords.value = [...newSelectedClipImage.keywords];
		} else {
			imageSrc.value = '';
			keywords.value = [];
		}
	},
	{ immediate: true }
);

function addClipImage() {
	if (!imageSrc.value.includes('http')) return;

	props.clipImages.push({
		id: uuidv4(),
		src: imageSrc.value,
		keywords: [...keywords.value],
	});

	emit('update:clipImages', props.clipImages);
	localStorage.setItem('images', JSON.stringify(props.clipImages));

	imageSrc.value = '';
	keywords.value = [];
}

function editClipImage() {
	if (!props.selectedClipImage) return;
	if (!imageSrc.value.includes('http')) return;

	const index = props.clipImages.findIndex((img) => img.id === props.selectedClipImage?.id);
	if (index === -1) return;

	props.clipImages[index] = {
		...props.clipImages[index],
		src: imageSrc.value,
		keywords: [...keywords.value],
	};

	emit('update:clipImages', props.clipImages);
	localStorage.setItem('images', JSON.stringify(props.clipImages));
}
</script>

<template>
	<div class="grid grid-cols-2">
		<div>
			<div class="mb-4">
				<Input v-model="imageSrc" placeholder="Image URL" />
			</div>
			<div class="mb-4">
				<TagsInput v-model="keywords">
					<TagsInputItem v-for="item in keywords" :key="item" :value="item">
						<TagsInputItemText />
						<TagsInputItemDelete />
					</TagsInputItem>

					<TagsInputInput placeholder="Keywords" />
				</TagsInput>
			</div>
			<div>
				<Button v-if="clipMode === ClipMode.EDIT" @click="editClipImage" class="w-full"
					>Edit</Button
				>
				<Button v-else @click="addClipImage" class="w-full">Add</Button>
			</div>
		</div>
		<div class="flex justify-center items-center">
			<img
				v-if="imageSrc && imageSrc.includes('http')"
				class="h-30 w-30 bg-neutral-700 rounded-lg"
				:src="imageSrc"
			/>
			<div v-else class="h-30 w-30 bg-neutral-700 rounded-lg" />
		</div>
	</div>
</template>
