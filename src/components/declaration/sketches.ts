import rough from "roughjs";

// Hand-drawn ink wireframes of each real build, laid out to match its
// screenshot (1200×900 frame) so the sketch → reality wipe lines up.
export type SketchKind = "website" | "saas" | "automation" | "mobile";

const INK = "#1F2433";
const RED = "#B5242E";
const BLUE = "#1E3663";
const NS = "http://www.w3.org/2000/svg";

export function drawSketch(svg: SVGSVGElement, kind: SketchKind, seed = 7) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const rc = rough.svg(svg);
  const o = (extra: Record<string, unknown> = {}) => ({ seed, roughness: 1.5, bowing: 1.2, stroke: INK, strokeWidth: 2.2, ...extra });
  const add = (n: SVGElement) => svg.appendChild(n);
  const rect = (x: number, y: number, w: number, h: number, extra = {}) => add(rc.rectangle(x, y, w, h, o(extra)));
  const line = (x1: number, y1: number, x2: number, y2: number, w = 2, extra = {}) => add(rc.line(x1, y1, x2, y2, o({ strokeWidth: w, ...extra })));
  const circle = (x: number, y: number, d: number, extra = {}) => add(rc.circle(x, y, d, o(extra)));
  const poly = (pts: [number, number][], extra = {}) => add(rc.linearPath(pts, o(extra)));
  const hatch = (x: number, y: number, w: number, h: number, color = RED) =>
    rect(x, y, w, h, { fill: color, fillStyle: "hachure", hachureGap: 7, stroke: color });
  const note = (x: number, y: number, text: string, color = RED, rot = -4, size = 34) => {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(x));
    t.setAttribute("y", String(y));
    t.setAttribute("fill", color);
    t.setAttribute("font-family", "Caveat, cursive");
    t.setAttribute("font-weight", "700");
    t.setAttribute("font-size", String(size));
    t.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
    t.textContent = text;
    add(t);
  };
  const arrow = (x1: number, y1: number, x2: number, y2: number, color = INK) => {
    line(x1, y1, x2, y2, 2.4, { stroke: color });
    const a = Math.atan2(y2 - y1, x2 - x1);
    line(x2, y2, x2 - 16 * Math.cos(a - 0.45), y2 - 16 * Math.sin(a - 0.45), 2.4, { stroke: color });
    line(x2, y2, x2 - 16 * Math.cos(a + 0.45), y2 - 16 * Math.sin(a + 0.45), 2.4, { stroke: color });
  };
  const browserBar = () => {
    line(0, 70, 1200, 70, 1.6);
    [26, 52, 78].forEach((x) => circle(x, 34, 14));
    rect(120, 44, 760, 20, { strokeWidth: 1.4 });
  };

  if (kind === "website") {
    browserBar();
    rect(85, 92, 150, 26);
    [390, 470, 560, 660, 760].forEach((x) => line(x, 106, x + 60, 106, 2));
    line(905, 106, 960, 106, 2);
    hatch(1000, 86, 115, 38);
    line(85, 196, 600, 192, 16);
    line(85, 256, 520, 254, 16);
    line(85, 316, 615, 312, 16);
    [368, 390, 412].forEach((y, i) => line(85, y, 410 - i * 30, y + 1, 2));
    hatch(85, 446, 135, 40);
    rect(236, 446, 140, 40);
    rect(650, 165, 460, 360);
    poly([[685, 410], [725, 380], [765, 392], [805, 340], [845, 356], [885, 300]], { stroke: BLUE, strokeWidth: 3 });
    rect(910, 190, 175, 250);
    [230, 280, 330, 380].forEach((y) => { circle(935, y, 20); line(955, y, 1050, y, 1.6); });
    rect(690, 420, 250, 90);
    [600].forEach((y) => [100, 280, 460, 640, 820, 1000].forEach((x) => line(x, y, x + 110, y + 2, 3)));
    [85, 435, 785].forEach((x) => { rect(x, 640, 330, 140); rect(x + 24, 664, 40, 40); line(x + 84, 676, x + 240, 676, 3); line(x + 84, 706, x + 290, 706, 1.6); line(x + 84, 728, x + 250, 728, 1.6); });
    note(88, 172, "big confident headline", RED, -3);
    note(820, 150, "live dashboard!", BLUE, -5);
    note(92, 578, "trust logos", BLUE, -2, 28);
    arrow(400, 520, 300, 494, RED);
    note(408, 534, "the money button", RED, -3, 30);
  }

  if (kind === "saas") {
    browserBar();
    line(170, 70, 170, 900, 2);
    rect(24, 92, 120, 26);
    hatch(16, 148, 140, 34, RED);
    [210, 250, 290, 330, 370, 410, 450, 490, 530].forEach((y) => { rect(28, y - 10, 18, 18, { strokeWidth: 1.4 }); line(56, y, 140, y, 1.6); });
    line(200, 128, 330, 126, 12);
    line(200, 160, 310, 160, 1.6);
    rect(720, 92, 230, 30, { strokeWidth: 1.6 });
    circle(1130, 106, 34);
    [200, 445, 690, 935].forEach((x, i) => {
      rect(x, 188, 230, 100);
      line(x + 18, 214, x + 110, 214, 1.6);
      line(x + 18, 244, x + 100, 244, 9);
      poly([[x + 140, 260], [x + 160, 240], [x + 175, 252], [x + 195, 220], [x + 215, 232]], { stroke: i % 2 ? BLUE : RED, strokeWidth: 2.6 });
    });
    rect(200, 308, 660, 260);
    [216, 345, 474, 603, 732].forEach((x) => { line(x, 334, x + 100, 334, 2); [355, 410, 465].forEach((y) => rect(x, y, 112, 46, { strokeWidth: 1.4 })); });
    rect(880, 308, 290, 260);
    [350, 400, 450, 500].forEach((y) => { circle(910, y, 30); line(935, y - 6, 1080, y - 6, 2); line(935, y + 10, 1040, y + 10, 1.4); });
    rect(200, 592, 320, 280);
    poly([[225, 830], [265, 790], [305, 800], [345, 750], [385, 765], [425, 700], [470, 690], [500, 630]], { stroke: RED, strokeWidth: 3 });
    rect(540, 592, 320, 280);
    [[575, 640], [635, 700], [695, 760], [755, 765], [815, 790]].forEach(([x, top], i) =>
      rect(x, top, 38, 840 - top, { fill: i === 0 ? RED : i === 1 ? BLUE : INK, fillStyle: "hachure", hachureGap: 6, strokeWidth: 1.6 })
    );
    rect(880, 592, 290, 140);
    [630, 660, 690].forEach((y) => { circle(902, y, 16); line(920, y, 1060, y, 1.6); });
    note(214, 302, "pipeline at a glance", RED, -2, 30);
    note(700, 176, "KPIs up top", BLUE, -3, 30);
  }

  if (kind === "automation") {
    line(60, 90, 560, 86, 16);
    line(60, 146, 620, 143, 16);
    [196, 220, 244].forEach((y, i) => line(60, y, 470 - i * 40, y + 1, 2));
    const xs = [50, 290, 530, 770, 1010];
    xs.forEach((x, i) => {
      rect(x, 280, 200, 400);
      circle(x + 30, 312, 34, { stroke: RED });
      line(x + 56, 312, x + 170, 312, 2.4);
      if (i < xs.length - 1) arrow(x + 204, 480, x + 236, 480, RED);
    });
    [380, 420, 460, 500].forEach((y) => rect(70, y, 160, 24, { strokeWidth: 1.4 }));
    hatch(70, 540, 160, 30, RED);
    circle(360, 420, 70);
    [480, 506].forEach((y) => line(320, y, 460, y, 1.6));
    circle(630, 430, 100, { stroke: BLUE });
    rect(560, 520, 140, 110, { strokeWidth: 1.4 });
    rect(805, 360, 130, 260, { strokeWidth: 2 });
    rect(830, 440, 90, 60, { fill: BLUE, fillStyle: "hachure", hachureGap: 6, stroke: BLUE });
    rect(1040, 360, 140, 200);
    poly([[1080, 430], [1105, 456], [1150, 400]], { stroke: RED, strokeWidth: 5 });
    rect(40, 730, 1120, 120, { strokeWidth: 1.6 });
    [90, 320, 550, 780, 1010].forEach((x) => { circle(x, 790, 46); line(x + 36, 780, x + 170, 780, 2); line(x + 36, 802, x + 140, 802, 1.4); });
    note(300, 262, "form → CRM → AI call → SMS → booked!", BLUE, -1, 32);
  }

  if (kind === "mobile") {
    rect(130, 140, 250, 560, { strokeWidth: 1.4, stroke: "#8B93A6" });
    [200, 250, 300].forEach((y) => { circle(170, y, 22, { stroke: "#8B93A6" }); line(195, y, 330, y, 1.4, { stroke: "#8B93A6" }); });
    rect(820, 140, 250, 560, { strokeWidth: 1.4, stroke: "#8B93A6" });
    circle(905, 250, 120, { stroke: "#8B93A6" });
    rect(420, 70, 360, 800, { strokeWidth: 3 });
    line(540, 96, 660, 96, 6);
    line(460, 160, 560, 160, 2);
    hatch(585, 150, 22, 22, RED);
    line(612, 160, 700, 160, 6);
    line(460, 218, 690, 216, 8);
    line(460, 244, 660, 244, 1.6);
    rect(450, 275, 300, 140);
    line(470, 300, 590, 300, 1.6);
    line(470, 336, 540, 336, 10);
    circle(690, 330, 70, { stroke: BLUE, strokeWidth: 3 });
    line(470, 390, 700, 390, 4, { stroke: BLUE });
    [450, 552, 654].forEach((x) => rect(x, 432, 96, 82, { strokeWidth: 1.6 }));
    line(460, 548, 580, 548, 4);
    [590, 650, 710, 770].forEach((y, i) => { circle(480, y, 24, { stroke: i === 0 ? RED : i === 1 ? BLUE : INK }); line(505, y - 6, 660, y - 6, 2); line(505, y + 12, 620, y + 12, 1.4); });
    line(480, 602, 480, 758, 1.4);
    rect(450, 790, 300, 40, { stroke: RED });
    note(760, 330, "← launch progress", RED, -4, 32);
    note(140, 760, "roadmap + milestones", BLUE, -3, 32);
  }
}
