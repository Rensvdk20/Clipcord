<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { toggleVariants } from '@/components/ui/toggle';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui';
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue';
import { cn } from '@/lib/utils';

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<
	ToggleGroupRootProps & {
		class?: HTMLAttributes['class'];
		variant?: ToggleGroupVariants['variant'];
		size?: ToggleGroupVariants['size'];
	}
>();
const emits = defineEmits<ToggleGroupRootEmits>();

provide('toggleGroup', {
	variant: props.variant,
	size: props.size,
});

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const activeIndex = ref<number | null>(null);
const itemRects = ref<DOMRect[]>([]);

const updateRects = () => {
	const groupEl = document.querySelector('[data-slot=toggle-group]');
	if (!groupEl) return;
	const items = groupEl.querySelectorAll('[data-slot=toggle-group-item]');
	itemRects.value = Array.from(items).map((el) => el.getBoundingClientRect());
};

const highlightStyle = computed(() => {
	if (activeIndex.value == null || !itemRects.value[activeIndex.value]) return {};
	const rect = itemRects.value[activeIndex.value];
	return {
		width: `${rect.width}px`,
		transform: `translateX(${rect.left - itemRects.value[0].left}px)`,
	};
});

watch(
	() => props.modelValue,
	async () => {
		await nextTick();
		updateRects();
		const items = document.querySelectorAll('[data-slot=toggle-group-item]');
		const index = Array.from(items).findIndex(
			(el) => (el as HTMLElement).dataset.state === 'on'
		);
		activeIndex.value = index >= 0 ? index : null;
	},
	{ immediate: true }
);

onMounted(() => {
	updateRects();
});
</script>

<template>
	<ToggleGroupRoot
		v-slot="slotProps"
		data-slot="toggle-group"
		:data-size="size"
		:data-variant="variant"
		v-bind="forwarded"
		:class="
			cn(
				'group/toggle-group relative flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
				props.class
			)
		"
	>
		<div
			v-if="activeIndex !== null"
			class="absolute top-0 left-0 h-full rounded-xl bg-violet-600/20 transition-transform duration-300 ease-in-out"
			:style="highlightStyle"
		/>

		<slot v-bind="slotProps" />
	</ToggleGroupRoot>
</template>
