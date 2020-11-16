const eyedropperBtn = document.getElementById('eyedropperBtn');
eyedropperBtn.addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(
    {
      format: 'png',
    },
    (dataUrl) => {
      chrome.tabs.executeScript({
        //   code: `const canvas = document.createElement('canvas');
        // canvas.id = 'canvas';
        // canvas.style.width = window.innerWidth;
        // canvas.style.height = window.innerHeight;
        // canvas.style.position = "absolute";
        // canvas.style.top = 0;
        // canvas.style.left = 0;
        // const context = canvas.getContext('2d');
        // const img = new Image();
        // img.src = "${dataUrl}";
        // img.onload = () => {
        //   context.drawImage(img, 0, 0)
        // }
        // document.body.appendChild(canvas);
        // `,
        code: `
        img = document.createElement("img");
        img.src = "${dataUrl}";
        img.style.width = "100vw";
        img.style.height = "100vh";
        document.body.appendChild(img);
      `,
      });
    }
  );
});

// const p = document.createElement('p'); p.innerHTML = ${dataUrl}; document.body.appendChild(p); console.log(${dataUrl})
