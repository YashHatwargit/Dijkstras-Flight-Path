let startSelected = false;
let startCountry = "";
let destinationCountry = "";

const shortestDistancePath = [
    [{ node: 1, weight: 4000 }, { node: 7, weight: 2500 }, { node: 8, weight: 2000 }],
    [{ node: 0, weight: 4000 }, { node: 2, weight: 1500 }, { node: 7, weight: 3700 },{ node: 6, weight: 3000 }],
    [{ node: 1, weight: 1500 }, { node: 4, weight: 3900 }],
    [{ node: 6, weight: 3000 }, { node: 5, weight: 4500 }],
    [{ node: 8, weight: 1200 }, { node: 6, weight: 2000 }, { node: 2, weight: 3900 }, { node: 9, weight: 500 }],
    [{ node: 3, weight: 4500 }, { node: 6, weight: 3000 }, { node: 9, weight: 5000 }],
    [{ node: 5, weight: 3000 }, { node: 3, weight: 3000 }, { node: 1, weight: 3000 }, { node: 4, weight: 2000 }],
    [{ node: 0, weight: 2500 }, { node: 1, weight: 3700 }],
    [{ node: 0, weight: 2000 }, { node: 4, weight: 1200 }],
    [{ node: 4, weight: 500 }, { node: 5, weight: 5000 }]
];

const countryToVertex = {
    "United States": 0,
    "France": 1,
    "Sweden": 2,
    "South Africa": 3,
    "China": 4,
    "Australia": 5,
    "India": 6,
    "Brazil": 7,
    "Russia": 8,
    "Japan": 9
};

const vertexToCountry = Object.keys(countryToVertex).reduce((acc, country) => {
    acc[countryToVertex[country]] = country;
    return acc;
}, {});

function dijkstra(adj, src) {
    const dist = new Array(10).fill(Infinity);
    const parent = new Array(10).fill(-1);
    const pq = new MinPriorityQueue({ priority: x => x.distance });

    dist[src] = 0;
    pq.enqueue({ node: src, distance: 0 });

    while (!pq.isEmpty()) {
        const { node: u } = pq.dequeue();

        for (const { node: v, weight } of adj[u]) {
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.enqueue({ node: v, distance: dist[v] });
                parent[v] = u;
            }
        }
    }

    return { dist, parent };
}

function getPath(parent, dest) {
    const path = [];
    let current = dest;
    while (current != -1) {
        path.unshift(vertexToCountry[current]);
        current = parent[current];
    }
    return path;
}
function forceScrollTo(percent) {
    const viewportHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollPosition = (percent / 100) * documentHeight;
    
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

function selectCountry(type, country) {
    if (!startSelected) {
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.destination').style.display = 'block';
        startCountry = country;
        startSelected = true;
        updateButtonFunctionality('destination');

        // Scroll to the middle of the page as soon as the start is selected
        forceScrollTo(50);
    } else {
        destinationCountry = country;
        const startVertex = countryToVertex[startCountry];
        const endVertex = countryToVertex[destinationCountry];

        const { dist, parent } = dijkstra(shortestDistancePath, startVertex);
        const shortestDistance = dist[endVertex];
        const path = getPath(parent, endVertex);

        if (shortestDistance === Infinity) {
            document.querySelector('.execute p').innerText = `No path found from ${startCountry} to ${destinationCountry}.`;
        } else {
            document.querySelector('.execute p').innerText = `Shortest Path from ${startCountry} to ${destinationCountry}: ${shortestDistance} Km \nPath: ${path.join(' -> ')}`;
            animatePath(path);
        }

        // Scroll to 55% of the document height after selecting the destination
        forceScrollTo(55);

        resetSelection();
    }
}




function updateButtonFunctionality(type) {
    const buttons = document.querySelectorAll('.pin');
    buttons.forEach(button => {
        button.setAttribute('onclick', `selectCountry('${type}', '${button.innerText}')`);
    });
}

function resetSelection() {
    document.querySelector('.start').style.display = 'block';
    document.querySelector('.destination').style.display = 'none';
    startSelected = false;
    startCountry = "";
    destinationCountry = "";
    updateButtonFunctionality('start');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.start').style.display = 'block';
});

class MinPriorityQueue {
    constructor({ priority = x => x } = {}) {
        this._heap = [];
        this._priority = priority;
    }
    _parent(i) { return ((i + 1) >>> 1) - 1; }
    _left(i) { return (i << 1) + 1; }
    _right(i) { return (i + 1) << 1; }

    _greater(i, j) { return this._priority(this._heap[i]) > this._priority(this._heap[j]); }
    enqueue(value) {
        this._heap.push(value);
        this._siftUp();
    }
    dequeue() {
        const value = this._heap[0];
        const last = this._heap.pop();
        if (this._heap.length > 0) {
            this._heap[0] = last;
            this._siftDown();
        }
        return value;
    }
    isEmpty() {
        return this._heap.length === 0;
    }
    _siftUp() {
        let node = this._heap.length - 1;
        while (node > 0 && this._greater(this._parent(node), node)) {
            this._swap(this._parent(node), node);
            node = this._parent(node);
        }
    }
    _siftDown() {
        let node = 0;
        while ((this._left(node) < this._heap.length && this._greater(node, this._left(node))) ||
            (this._right(node) < this._heap.length && this._greater(node, this._right(node)))) {
            let maxChild = (this._right(node) < this._heap.length && this._greater(this._left(node), this._right(node))) ? this._right(node) : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
}

const countryPositions = {
    "United States": { x: 231 + 40, y: 265 + 340 },
    "France": { x: 528 + 40, y: 238 + 310 },
    "Sweden": { x: 573 + 40, y: 172 + 220 },
    "South Africa": { x: 578 + 40, y: 407 + 540 },
    "China": { x: 805 + 80, y: 247 + 290 },
    "Australia": { x: 891 + 90, y: 418 + 505 },
    "India": { x: 735 + 80, y: 308 + 360 },
    "Brazil": { x: 350 + 40, y: 391 + 460 },
    "Russia": { x: 870 + 90, y: 170 + 190 },
    "Japan": { x: 922 + 90, y: 266 + 300 }
};


function resizeCanvasToImage() {
    const canvas = document.getElementById('pathCanvas');
    const mapImg = document.querySelector('.world-map');
    
    // Set the canvas size to match the image size
    canvas.width = mapImg.clientWidth;
    canvas.height = mapImg.clientHeight;

    // Calculate the scaling factors
    const scaleFactorX = canvas.width / 1200;  // 1200 is the original width used in country positions
    const scaleFactorY = canvas.height / 1200; // 1200 is the original height used in country positions

    // Adjust country positions based on new dimensions
    for (let country in countryPositions) {
        countryPositions[country].scaledX = countryPositions[country].x * scaleFactorX;
        countryPositions[country].scaledY = countryPositions[country].y * scaleFactorY;
    }
}

function drawGreenDottedLines() {
    const canvas = document.getElementById('pathCanvas');
    const ctx = canvas.getContext('2d');

    // Draw green dotted lines between all connected countries
    ctx.beginPath();
    ctx.strokeStyle = '#0f0'; // Green color
    ctx.setLineDash([5, 15]); // Dotted line pattern
    ctx.lineWidth = 2;

    shortestDistancePath.forEach((connections, u) => {
        const startCountry = vertexToCountry[u];
        const startPos = countryPositions[startCountry];
        connections.forEach(({ node: v }) => {
            const endCountry = vertexToCountry[v];
            const endPos = countryPositions[endCountry];
            ctx.moveTo(startPos.scaledX, startPos.scaledY);
            ctx.lineTo(endPos.scaledX, endPos.scaledY);
        });
    });

    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash for future drawings
}

function animatePath(path) {
    const canvas = document.getElementById('pathCanvas');
    const ctx = canvas.getContext('2d');
    let airplane = new Image();
    airplane.src = 'aeroplane.jpg';

    resizeCanvasToImage(); // Ensure the canvas is always in sync with the image size

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGreenDottedLines(); // Draw green dotted lines first

    // Draw the entire path
    ctx.beginPath();
    ctx.strokeStyle = '#f00'; // Blue color
    ctx.lineWidth = 2;
    for (let i = 0; i < path.length - 1; i++) {
        const startPos = countryPositions[path[i]];
        const endPos = countryPositions[path[i + 1]];
        ctx.moveTo(startPos.scaledX, startPos.scaledY);
        ctx.lineTo(endPos.scaledX, endPos.scaledY);
    }
    ctx.stroke();

    let index = 0;
    function moveAirplane() {
        const startPos = countryPositions[path[index]];
        const endPos = countryPositions[path[index + 1]];
        let dx = endPos.scaledX - startPos.scaledX;
        let dy = endPos.scaledY - startPos.scaledY;
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let incrementX = dx / steps;
        let incrementY = dy / steps;
        let x = startPos.scaledX;
        let y = startPos.scaledY;

        function animateFrame() {
            if (Math.abs(x - endPos.scaledX) < Math.abs(incrementX) && Math.abs(y - endPos.scaledY) < Math.abs(incrementY)) {
                index++;
                if (index < path.length - 1) {
                    requestAnimationFrame(moveAirplane);
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                drawGreenDottedLines(); // Redraw green dotted lines
                ctx.beginPath();
                ctx.strokeStyle = '#f00'; // Blue color
                ctx.lineWidth = 2;
                for (let i = 0; i < path.length - 1; i++) {
                    const startPos = countryPositions[path[i]];
                    const endPos = countryPositions[path[i + 1]];
                    ctx.moveTo(startPos.scaledX, startPos.scaledY);
                    ctx.lineTo(endPos.scaledX, endPos.scaledY);
                }
                ctx.stroke();

                ctx.drawImage(airplane, x - 15, y - 15, 45, 45);
                x += incrementX;
                y += incrementY;
                requestAnimationFrame(animateFrame);
            }
        }
        animateFrame();
    }

    moveAirplane();
}

// Call resizeCanvasToImage on window resize to keep everything scaled properly
window.addEventListener('resize', resizeCanvasToImage);
