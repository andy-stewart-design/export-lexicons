<script lang="ts">
  import "./app.css";
  import { IconData, SVGPaths } from "./code";

  let iconData: IconData[];
  let iconSizes: string[];

  onmessage = (event) => {
    const decoder = new TextDecoder();
    const data: IconData[] = event.data.pluginMessage.payload;

    const iconArray = data.map((iconData) => {
      const sizes = Object.keys(iconData.paths);
      const bytes = Object.values(iconData.paths);

      if (!iconSizes) iconSizes = sizes;

      const svgs = bytes.map((byte, index) => {
        const code = decoder
          .decode(byte)
          .replace(/stroke="([^"]*)"/, "stroke='currentColor'")
          .replace(/stroke-width="([^"]*)"/, "stroke-width='1.5'");

        // This is how I actually get the path rather than the whole SVG
        console.log(code.match(/d="([^"]*)"/)[1]);

        return [sizes[index], code];
      });

      const convertedPaths = Object.fromEntries(svgs) as SVGPaths;

      return { name: iconData.name, paths: convertedPaths };
    });

    iconData = iconArray;
  };
</script>

<div class="flex min-h-full flex-col items-center justify-center gap-4 p-4">
  {#if iconData}
    {#each iconData as icon}
      <div class="flex flex-col items-center">
        <p>{icon.name}</p>
        <div class="flex items-center gap-2">
          {#each Object.values(icon.paths) as path, index}
            <p class="text-xs opacity-50">{iconSizes[index]}</p>
            {@html path}
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>
<!-- <pre class="text-xs">
  {JSON.stringify(icons, null, 2)}
</pre> -->
