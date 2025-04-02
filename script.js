const body = document.querySelector("body");
const btn = document.createElement("button");
btn.textContent = 'Change canvas size';
body.appendChild(btn);
const container = document.createElement("div");
body.appendChild(container);
container.classList.add("container");
const allDivs = document.querySelectorAll('.innerDiv');

let divCount;

btn.addEventListener("click", () => {
    divCount = +prompt("What should the width of one side of your grid be? (Max = 100)");
if (divCount > 100) {
    divCount = +prompt('Please make the side length less than 100');
} else {
    clearGrid();
    createGrid();
}
    
})

let div;

function createGrid() {

for (let i = 0; i < divCount*divCount; i++) {
    
div = document.createElement("div");
div.classList.add("innerDiv");
div.id = `${i+1}`;
div.style.height = `${100/divCount}%`;
div.style.width = `${100/divCount}%`;
container.appendChild(div);

let target;
div.addEventListener("mouseenter", (e) => {
    target = e.target;
    if (target.style.backgroundColor) {
        target.style.opacity = `${+target.style.opacity+0.1}`
        return;
    } else {
    target.style.backgroundColor = `rgb(${Math.round(Math.random()*256)}, ${Math.round(Math.random()*256)}, ${Math.round(Math.random()*256)})`;
    target.style.opacity = '0.1';
    }
})  
console.log(target);
}
}


function clearGrid() {
    if (container.children.length > 0) {
        container.innerHTML = '';
    }
    else return;
}