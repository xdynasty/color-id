const eyedropperBtn = document.getElementById('eyedropperBtn');
eyedropperBtn.addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(
    {
      format: 'png',
    },
    (dataUrl) => {
      chrome.tabs.executeScript({
        code: `
        canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.style.position = "absolute";
        scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
        canvas.style.top = scrollHeight;
        console.log("scrollHeight:", scrollHeight);
        canvas.style.left = 0;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvas.innerHeight = window.innerHeight;
        canvas.style.zIndex = "99999";
        context = canvas.getContext('2d');
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
        dpr = window.devicePixelRatio || 1;
        // context.scale(dpr, dpr);
        img = new Image();
        img.src = "${dataUrl}";
        img.onload = () => {
          context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight)
        }
        document.body.appendChild(canvas);

        colorContainer = document.createElement("div");
        colorContainer.id = "colorContainer";
        colorContainer.style.position = "absolute";
        colorContainer.style.padding = "8px";
        colorContainer.style.zIndex = "99999";
        colorContainer.style.pointerEvents = "none";
        colorContainer.style.display = "flex";
        colorContainer.style.alignItems = "center";
        colorContainer.style.flexDirection = "column";

        rgbaTextInput = document.createElement("input");
        rgbaTextInput.id = "rgbaTextInput";
        rgbaTextInput.readonly = true;

        hexTextInput = document.createElement("input");
        hexTextInput.id = "hexTextInput";
        hexTextInput.readonly = true;

        zoomCanvas = document.createElement('canvas');
        zoomCanvas.id = "zoomCanvas";
        colorContainer.appendChild(zoomCanvas);
        colorContainer.appendChild(rgbaTextInput);
        colorContainer.appendChild(hexTextInput);

        zoomCtx = zoomCanvas.getContext('2d');
        zoomCanvas.style.width = "175px";
        zoomCanvas.style.height = "175px";
        zoomCtx.canvas.width = 175 * 2;
        zoomCtx.canvas.height = 175 * 2;
        zoomCtx.scale(dpr, dpr);
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.mozImageSmoothingEnabled = false;
        zoomCtx.webkitImageSmoothingEnabled = false;
        zoomCtx.msImageSmoothingEnabled = false;
        canvas.addEventListener("mouseenter", () => {
          document.body.appendChild(colorContainer)
        })

        canvas.addEventListener("mouseleave", () => {
          document.body.removeChild(colorContainer);
        })

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

        document.onkeydown = (event) => {
          if (event.key === "Escape") {
            document.body.removeChild(colorContainer);
            document.body.removeChild(canvas);
          }
        }

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
          if (x + 220 < window.innerWidth) {
            colorContainer.style.left = event.pageX + 20 + "px";
          } else {
            colorContainer.style.left = event.pageX - 200 + "px";
          }

          if (y + 260 < window.innerHeight) {
            colorContainer.style.top = event.pageY + 20 + "px";
          } else {
            colorContainer.style.top = event.pageY - 250 + "px";
          }

          zoom(zoomCtx, x, y);
        });

        `,
      });
    }
  );
});
