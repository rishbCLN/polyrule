---
id: vue
title: Vue 3
tags: [framework, vue, frontend]
globs: ["**/*.vue"]
description: Vue 3 Composition API conventions.
---

- Use the Composition API with `<script setup>` for new components.
- Type props and emits explicitly with `defineProps`/`defineEmits` generics.
- Keep reactive state with `ref`/`reactive`; do not mutate props — emit events instead.
- Extract reusable logic into composables (`useX`) rather than mixins.
- Prefer `computed` for derived state over watchers; reserve `watch`/`watchEffect` for side effects.
- Clean up listeners, intervals, and subscriptions in `onUnmounted`.
- Provide stable `:key` values on `v-for`; never use the index for dynamic lists.
- Keep components single-responsibility; lift shared state into a store (Pinia) when it spans components.
- Scope styles with `<style scoped>` and use design tokens over hardcoded values.
