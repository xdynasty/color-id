const eyedropperBtn = document.getElementById('eyedropperBtn');
eyedropperBtn.addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(
    {
      format: 'png',
    },
    (dataUrl) => {
      chrome.tabs.executeScript({
        code: `const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.left = 0;
        const context = canvas.getContext('2d');
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
        const img = new Image();
        img.src = "${dataUrl}";
        img.onload = () => {
          context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight)
        }
        document.body.appendChild(canvas);
        `,
      });
    }
  );
});

// const p = document.createElement('p'); p.innerHTML = ${dataUrl}; document.body.appendChild(p); console.log(${dataUrl})
