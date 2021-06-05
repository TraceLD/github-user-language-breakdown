<script lang="ts">
    import { onMount } from "svelte";
    import { getLanguages } from "./api/languages/[githubName].json"
    const s: Map<string, number> = new Map<string, number>();
    
    onMount(async (): Promise<void> => {
        const r = await getLanguages("john01dav", false);
        console.log(new Map(Object.entries(r.entity.Languages)));
    });
</script>

<main>    
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
