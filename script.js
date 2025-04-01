const body = document.querySelector("body");
const container = document.createElement("div");
body.appendChild(container);
container.classList.add("container");
const btn = document.querySelector('.sizeChange');
let divCount

btn.addEventListener("click", () => {
    divCount = +prompt("What should the width of one side of your grid be? (Max = 100)");
if (divCount > 100) {
    divCount = +prompt('Please make the side length less than 100');
}
})


let div;
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
    
    target.style.backgroundColor = 'blue'
})
console.log(target);
}


