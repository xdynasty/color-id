const eyedropperBtn = document.getElementById('eyedropperBtn');
eyedropperBtn.addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(
    {
      format: 'png',
    },
    (dataUrl) => {
      chrome.tabs.executeScript({
        code: `
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = "99999";
        const context = canvas.getContext('2d');
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
        const img = new Image();
        img.src = "${dataUrl}";
        img.onload = () => {
          context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight)
        }
        document.body.appendChild(canvas);

        const colorContainer = document.createElement("div");
        colorContainer.id = "colorContainer";
        colorContainer.style.position = "absolute";
        colorContainer.style.zIndex = "99999";
        colorContainer.style.pointerEvents = "none";
        colorContainer.style.display = "flex";
        colorContainer.style.alignItems = "center";
        colorContainer.style.flexDirection = "column";

        const rgbaTextInput = document.createElement("input");
        rgbaTextInput.id = "rgbaTextInput";
        rgbaTextInput.readonly = true;

        const zoomCanvas = document.createElement('canvas');
        zoomCanvas.id = "zoomCanvas";
        colorContainer.appendChild(zoomCanvas);
        colorContainer.appendChild(rgbaTextInput);
        const zoomCtx = zoomCanvas.getContext('2d');
        zoomCtx.canvas.width = 175;
        zoomCtx.canvas.height = 175;
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.mozImageSmoothingEnabled = false;
        zoomCtx.webkitImageSmoothingEnabled = false;
        zoomCtx.msImageSmoothingEnabled = false;
        document.body.appendChild(colorContainer)

        function zoom(ctx, x, y) {
          ctx.drawImage(canvas,
            Math.min(Math.max(0, x - 3), img.width - 3),
            Math.min(Math.max(0, y - 3), img.height - 3),
            5, 5,
            0, 0,
            175, 175);
        };

        canvas.addEventListener('mousemove', function(event) {
          const x = event.layerX;
          const y = event.layerY;
          colorContainer.style.left = event.pageX + "px";
          colorContainer.style.top = event.pageY+ "px";
          zoom(zoomCtx, x, y);
        });

        `,
      });
    }
  );
});
