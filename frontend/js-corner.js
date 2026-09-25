function makeMultiplier(n) {
return function (x) {
return n * x;
};
}

const double = makeMultiplier(2);
console.log(double(5));
console.log(double(10));

const triple = makeMultiplier(3);
console.log(triple(5));
console.log(triple(7));

console.log(double(4));

export default makeMultiplier;