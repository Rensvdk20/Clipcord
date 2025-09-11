<script setup lang="ts">
import type { ClipImage } from '@/types/clipImage';
import { ClipMode } from '@/types/clipMode';
import { toast } from 'vue-sonner';

const props = defineProps<{
	image: ClipImage;
	clipMode: ClipMode;
}>();

const emit = defineEmits<{
	(e: 'selectClipImage', image: ClipImage): void;
	(e: 'deleteClipImage', image: ClipImage): void;
}>();

function selectClipImage() {
	switch (props.clipMode) {
		case ClipMode.COPY:
			navigator.clipboard.writeText(props.image.src);
			return toast.success('Copied to clipboard');
		case ClipMode.EDIT:
			return emit('selectClipImage', props.image);
		case ClipMode.DELETE:
			return emit('deleteClipImage', props.image);
	}
}
</script>

<template>
	<div
		class="flex items-center p-2 hover:cursor-pointer hover:bg-neutral-700 rounded-lg"
		:class="{ 'hover:bg-red-600/10': props.clipMode === ClipMode.DELETE }"
		@click="selectClipImage"
	>
		<img class="max-h-fit" loading="lazy" :src="props.image.src" />
	</div>
</template>
