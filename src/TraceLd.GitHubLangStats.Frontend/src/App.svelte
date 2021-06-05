<script lang="ts">
    import { onMount } from "svelte";
    import { getLanguages } from "@services/languages/[githubName].json"
    import { getLanguagesChart } from "@services/chart";
    const s: Map<string, number> = new Map<string, number>();
    
    onMount(async (): Promise<void> => {
        const r = await getLanguages("john01dav", false);
        getLanguagesChart(r.entity);
    });
</script>

<main>    
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
