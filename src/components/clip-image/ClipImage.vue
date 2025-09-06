<script setup lang="ts">
import type { ClipImage } from '@/types/clipImage';
import { ClipMode } from '@/types/clipMode';

const props = defineProps<{
	image: ClipImage;
	clipMode: ClipMode;
}>();

const emit = defineEmits<{
	(e: 'selectClipImage', image: ClipImage): void;
}>();

function selectClipImage() {
	if (props.clipMode === ClipMode.COPY) return navigator.clipboard.writeText(props.image.src);
	if (props.clipMode === ClipMode.EDIT) return emit('selectClipImage', props.image);
}
</script>

<template>
	<div class="p-2 hover:cursor-pointer hover:bg-neutral-700 rounded-lg" @click="selectClipImage">
		<img class="max-h-fit" loading="lazy" :src="props.image.src" />
	</div>
</template>
