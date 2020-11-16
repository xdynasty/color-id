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
        colorContainer.style.padding = "8px";
        colorContainer.style.zIndex = "99999";
        colorContainer.style.pointerEvents = "none";
        colorContainer.style.display = "flex";
        colorContainer.style.alignItems = "center";
        colorContainer.style.flexDirection = "column";

        const rgbaTextInput = document.createElement("input");
        rgbaTextInput.id = "rgbaTextInput";
        rgbaTextInput.readonly = true;

        const hexTextInput = document.createElement("input");
        hexTextInput.id = "hexTextInput";
        hexTextInput.readonly = true;

        const zoomCanvas = document.createElement('canvas');
        zoomCanvas.id = "zoomCanvas";
        colorContainer.appendChild(zoomCanvas);
        colorContainer.appendChild(rgbaTextInput);
        colorContainer.appendChild(hexTextInput);
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
            ctx.beginPath();
            ctx.moveTo(70,0);
            ctx.lineTo(70,175);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(105, 0);
            ctx.lineTo(105, 175);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 70);
            ctx.lineTo(175, 70);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 105);
            ctx.lineTo(175, 105);
            ctx.stroke();
        };

        function componentToHex(c) {
          var hex = c.toString(16).toUpperCase();
          return hex.length == 1 ? "0" + hex : hex;
        }

        function pick(event) {
          var x = event.layerX;
          var y = event.layerY;
          var pixel = context.getImageData(x-1, y-1, 1, 1);
          var data = pixel.data;
          const rgba = "rgba(" + data[0] + ', ' + data[1] + ", " + data[2] + ", " + data[3] / 255 + ")";
          colorContainer.style.backgroundColor = rgba;
          rgbaTextInput.value = rgba;
          hexTextInput.value = "#" + componentToHex(data[0]) + componentToHex(data[1]) + componentToHex(data[2])
        }



        canvas.addEventListener('click', (event) => {
          pick(event);
        })

        canvas.addEventListener('mousemove', function(event) {
          const x = event.layerX;
          const y = event.layerY;
          if (x + 200 < window.innerWidth) {
            colorContainer.style.left = event.pageX + "px";
          } else {
            colorContainer.style.left = event.pageX - 200 + "px";
          }

          if (y + 225 < window.innerHeight) {
            colorContainer.style.top = event.pageY+ "px";
          } else {
            colorContainer.style.top = event.pageY - 225 + "px";
          }

          zoom(zoomCtx, x, y);
        });

        `,
      });
    }
  );
});
