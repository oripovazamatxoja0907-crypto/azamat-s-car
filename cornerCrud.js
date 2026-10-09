
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

return natija * 2; 
  } catch (error) {
    console.error("Xato bo'ldi:", error);
  }
}
ikkilantir().then(console.log); 


  
function yaratUser(ism, yosh = 18, rol = 'user') {
  return { ism, yosh, rol }; 
}
console.log(yaratUser('Ali'));
console.log(yaratUser('Vali', 25, 'admin'));


const maydon = 'shahar';
 const qiymat = 'Toshkent';


const obyekt = { [maydon]: qiymat };
 console.log(obyekt);


function fakeFetch(muvaffaqiyatli) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (muvaffaqiyatli) {
        resolve({ id: 1, nom: 'Ferrari F40' });
      } else {
        reject(new Error("Serverga ulanib bo'lmadi"));
      }
    }, 1000);
  });
}

async function xavfli(muvaffaqiyatli) {
  try {
    console.log("So'rov yuborilmoqda...");
    const data = await fakeFetch(muvaffaqiyatli);
    console.log('Keldi:', data);
  } catch (error) {
    console.log('Xato:', error.message);
  } finally {
    console.log('Tugadi (finally har safar ishlaydi)');
  }
}
async function main() {
  await xavfli(true); 
  console.log('---');
  await xavfli(false); 
}

main();