export interface SVGPaths {
  16: Uint8Array;
  20: Uint8Array;
  24: Uint8Array;
  32: Uint8Array;
}

export interface IconData {
  name: string;
  paths: SVGPaths;
}

figma.on("run", async () => {
  const selectedEls = figma.currentPage.selection;

  const promises = selectedEls.map((el) => {
    return el.exportAsync({ format: "SVG" });
  });

  const bytesArray = await Promise.all(promises);

  const iconData: IconData[] = bytesArray.reduce((acc, val, i) => {
    const size = selectedEls[i].width;
    const name = selectedEls[i].name;
    const existing = acc.find((item) => item.name === name);
    if (existing) {
      existing.paths[size] = val;
    } else {
      acc.push({ name, paths: { [size]: val } });
    }
    return acc;
  }, []);

  figma.ui.postMessage({
    payload: iconData,
  });
});

figma.showUI(__html__, { themeColors: true, width: 320, height: 400 });
