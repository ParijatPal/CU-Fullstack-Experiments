const svg = document.getElementById("stage");
const layer = document.getElementById("layer");
const hud = document.getElementById("hud");

let tool = "pen";
let drawing = false;
let startX = 0, startY = 0;
let currentElement = null;
let history = [], redoStack = [];

function updateHUD(points = 0) {
  hud.innerHTML = `Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)} • Points: ${points} <span class="hint">(Hold Shift to constrain)</span>`;
}

document.querySelectorAll("#tools button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("#tools .active")?.classList.remove("active");
    btn.classList.add("active");
    tool = btn.dataset.tool;
    updateHUD(0);
  });
});

function startDraw(e) {
  drawing = true;
  const pt = getMouse(e);
  startX = pt.x; startY = pt.y;
  const stroke = document.getElementById("strokeColor").value;
  const fill = document.getElementById("fillColor").value;
  const width = document.getElementById("strokeWidth").value;
  if (tool === "pen") {
    currentElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    currentElement.setAttribute("d", `M${startX},${startY}`);
    currentElement.setAttribute("fill", "none");
  } else if (tool === "line") {
    currentElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    currentElement.setAttribute("x1", startX);
    currentElement.setAttribute("y1", startY);
    currentElement.setAttribute("x2", startX);
    currentElement.setAttribute("y2", startY);
  } else if (tool === "rect") {
    currentElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    currentElement.setAttribute("x", startX);
    currentElement.setAttribute("y", startY);
    currentElement.setAttribute("width", 0);
    currentElement.setAttribute("height", 0);
  } else if (tool === "circle") {
    currentElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    currentElement.setAttribute("cx", startX);
    currentElement.setAttribute("cy", startY);
    currentElement.setAttribute("r", 0);
  }
  currentElement.setAttribute("stroke", stroke);
  currentElement.setAttribute("fill", fill);
  currentElement.setAttribute("stroke-width", width);
  layer.appendChild(currentElement);
}

function draw(e) {
  if (!drawing) return;
  const pt = getMouse(e);
  if (tool === "pen") {
    let d = currentElement.getAttribute("d");
    d += ` L${pt.x},${pt.y}`;
    currentElement.setAttribute("d", d);
    updateHUD(d.split("L").length);
  } else if (tool === "line") {
    currentElement.setAttribute("x2", pt.x);
    currentElement.setAttribute("y2", pt.y);
  } else if (tool === "rect") {
    currentElement.setAttribute("x", Math.min(startX, pt.x));
    currentElement.setAttribute("y", Math.min(startY, pt.y));
    currentElement.setAttribute("width", Math.abs(pt.x - startX));
    currentElement.setAttribute("height", Math.abs(pt.y - startY));
  } else if (tool === "circle") {
    const r = Math.sqrt(Math.pow(pt.x - startX, 2) + Math.pow(pt.y - startY, 2));
    currentElement.setAttribute("r", r);
  }
}

function endDraw() {
  if (!drawing) return;
  drawing = false;
  history.push(currentElement);
  redoStack = [];
}

function getMouse(e) {
  const rect = svg.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

svg.addEventListener("mousedown", startDraw);
svg.addEventListener("mousemove", draw);
svg.addEventListener("mouseup", endDraw);

document.getElementById("undo").addEventListener("click", () => {
  const el = history.pop();
  if (el) {
    redoStack.push(el);
    el.remove();
  }
});
document.getElementById("redo").addEventListener("click", () => {
  const el = redoStack.pop();
  if (el) {
    layer.appendChild(el);
    history.push(el);
  }
});
document.getElementById("clear").addEventListener("click", () => {
  layer.innerHTML = "";
  history = [];
  redoStack = [];
});
document.getElementById("download").addEventListener("click", () => {
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "drawing.svg";
  a.click();
});
