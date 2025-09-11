<script setup lang="ts">
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

const emit = defineEmits<{
	(e: 'delete:clipImages'): void;
}>();
</script>

<template>
	<Dialog>
		<DialogTrigger as-child>
			<Button variant="destructive">Delete all</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px] md:max-w-[500px]">
			<DialogHeader>
				<DialogTitle>Are you sure you want to delete all stored images?</DialogTitle>
				<DialogDescription>This action cannot be undone</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose class="flex gap-2 justify-center">
					<Button @click="emit('delete:clipImages')" variant="destructive" type="submit"
						>Delete</Button
					>
					<Button variant="outline" type="submit">Cancel</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
