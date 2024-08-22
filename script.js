let startSelected = false;
let startCountry = "";
let destinationCountry = "";

const shortestDistancePath = [
    [{ node: 1, weight: 4000 }, { node: 7, weight: 2500 }, { node: 8, weight: 2000 }],
    [{ node: 0, weight: 4000 }, { node: 2, weight: 1500 }, { node: 7, weight: 3700 }],
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

function selectCountry(type, country) {
    if (!startSelected) {
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.destination').style.display = 'block';
        startCountry = country;
        startSelected = true;
        updateButtonFunctionality('destination');
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
            document.querySelector('.execute p').innerText = `Shortest Path  from ${startCountry} to ${destinationCountry}: ${shortestDistance} Km \nPath: ${path.join(' -> ')}`;
            animatePath(path);
        }

       // Scroll to the bottom of the page
       window.scrollTo({
        top: document.body.scrollHeight * 0.35,
        behavior: 'smooth'
    });
    
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
    "United States": { x: 231 + 240, y: 265 + 250 },
    "France": { x: 528 + 230, y: 238 + 180 },
    "Sweden": { x: 573 + 240, y: 172 + 200 },
    "South Africa": { x: 578 + 240, y: 407 + 290 },
    "China": { x: 805 + 250, y: 247 + 230 },
    "Australia": { x: 891 + 240, y: 418 + 280 },
    "India": { x: 735 + 240, y: 308 + 250 },
    "Brazil": { x: 350 + 230, y: 391 + 270 },
    "Russia": { x: 870 + 230, y: 170 + 180 },
    "Japan": { x: 922 + 250, y: 266 + 225 }
};


function animatePath(path) {
    const canvas = document.getElementById('pathCanvas');
    const ctx = canvas.getContext('2d');
    let airplane = new Image();
    airplane.src = 'aeroplane.jpg'; 
    canvas.width = 1200; 
    canvas.height = 1200; 

    // Draw the entire path
    ctx.beginPath();
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 2;
    for (let i = 0; i < path.length - 1; i++) {
        const startPos = countryPositions[path[i]];
        const endPos = countryPositions[path[i + 1]];
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
    }
    ctx.stroke();

    let index = 0;
    function moveAirplane() {
        const startPos = countryPositions[path[index]];
        const endPos = countryPositions[path[index + 1]];
        let dx = endPos.x - startPos.x;
        let dy = endPos.y - startPos.y;
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let incrementX = dx / steps;
        let incrementY = dy / steps;
        let x = startPos.x;
        let y = startPos.y;

        function animateFrame() {
            if (Math.abs(x - endPos.x) < Math.abs(incrementX) && Math.abs(y - endPos.y) < Math.abs(incrementY)) {
                index++;
                if (index < path.length - 1) {
                    requestAnimationFrame(moveAirplane);
                }
            } else {

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.strokeStyle = '#00f';
                ctx.lineWidth = 2;
                for (let i = 0; i < path.length - 1; i++) {
                    const startPos = countryPositions[path[i]];
                    const endPos = countryPositions[path[i + 1]];
                    ctx.moveTo(startPos.x, startPos.y);
                    ctx.lineTo(endPos.x, endPos.y);
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
