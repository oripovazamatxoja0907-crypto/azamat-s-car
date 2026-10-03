
function kechiktirilganSon(son) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(son), 1000);
  });
}

async function ikkilantir() {
try {
console.log("kutyapmiz...");

const natija = await kechiktirilganSon(10); 
    console.log("olgan son:", natija);

return natija * 10; 
  } catch (error) {
    console.error("Xato bo'ldi:", error);
  }
}
ikkilantir().then(console.log); 