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
        const zoomCanvas = document.createElement('canvas');
        zoomCanvas.id = "zoomCanvas";
        zoomCanvas.style.position = "absolute";

        zoomCanvas.style.zIndex = "99999";
        zoomCanvas.style.pointerEvents = "none";
        const zoomCtx = zoomCanvas.getContext('2d');
        zoomCtx.canvas.width = 200;
        zoomCtx.canvas.height = 200;
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.mozImageSmoothingEnabled = false;
        zoomCtx.webkitImageSmoothingEnabled = false;
        zoomCtx.msImageSmoothingEnabled = false;
        document.body.appendChild(zoomCanvas)

        function zoom(ctx, x, y) {
          console.log("drawing")
          ctx.drawImage(canvas,
            Math.min(Math.max(0, x - 3), img.width - 3),
            Math.min(Math.max(0, y - 3), img.height - 3),
            11, 11,
            0, 0,
            175, 175);
        };



        canvas.addEventListener('mousemove', function(event) {
          const x = event.layerX;
          const y = event.layerY;
          zoomCanvas.style.left = event.pageX + "px";
          zoomCanvas.style.top = event.pageY+ "px";
          zoom(zoomCtx, x, y);
        });

        `,
      });
    }
  );
});

// const p = document.createElement('p'); p.innerHTML = ${dataUrl}; document.body.appendChild(p); console.log(${dataUrl})
