const overlayCanvas = document.getElementById("overlaycanvas");
const overlayCtx = overlayCanvas.getContext("2d");

let scale = 1;

let rectList = [];
let annulusList = [];
let circleList = [];

overlayCtx.canvas.width = window.innerWidth;
overlayCtx.canvas.height = window.innerHeight;
addEventListener("resize", (event) => {
	overlayCtx.canvas.width = window.innerWidth;
	overlayCtx.canvas.height = window.innerHeight;
});


function drawOverlayRect(x, y, w, h, color) {
	rectList.push({ x, y, w, h, color });
}

function drawOverlayAnnulus(radius, start, end, color = "#FFFFFF") {
	annulusList.push({ radius, start, end, color });
}

function drawOverlayCircle(radius, color = "#FFFFFF") {
	circleList.push({ radius, color });
}

function _drawOverlayRect(x, y, w, h, color) {
	overlayCtx.fillStyle = color;
	overlayCtx.fillRect(x * scale, y * scale, w * scale, h * scale);
}

function _drawOverlayAnnulus(radius, start, end, color = "#FFFFFF") {
	overlayCtx.globalAlpha = Alpine.store('data').ringTransparency / 100;
	overlayCtx.fillStyle = color;
	annulus(overlayCtx, 0, 0, (radius - 10) * scale, (radius + 10) * scale, start, end, true);
	overlayCtx.globalAlpha = 1.0;
}

function _drawOverlayCircle(radius, color) {
	overlayCtx.fillStyle = color;
	overlayCtx.globalAlpha = Alpine.store('data').ringTransparency / 100;
	overlayCtx.lineWidth = 20 * scale;
	overlayCtx.strokeStyle = color;
	overlayCtx.beginPath();
	overlayCtx.arc(0, 0, radius * scale, 0, 2 * Math.PI);
	overlayCtx.stroke();
	overlayCtx.globalAlpha = 1.0;
}

function drawOverlay() {
	const offset = getCoreRelativeOffset();
	scale = panZoomElem.getScale();

	overlayCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
	overlayCtx.translate(window.innerWidth / 2 - offset.x * scale, window.innerHeight / 2 - offset.y * scale)

	rectList.forEach(r => _drawOverlayRect(r.x, r.y, r.w, r.h, r.color));
	circleList.forEach(c => _drawOverlayCircle(c.radius, c.color));
	annulusList.forEach(a => _drawOverlayAnnulus(a.radius, a.start, a.end, a.color));

	overlayCtx.translate(-window.innerWidth / 2 + offset.x * scale, - window.innerHeight / 2 + offset.y * scale)

	if (Alpine.store('data').mapLoaded)
		requestAnimationFrame(drawOverlay);
}