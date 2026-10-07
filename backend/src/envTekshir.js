function envTekshir(nomlar) {
const natija = {};

nomlar.forEach((nom) => {
 natija[nom] = !!process.env[nom];
});

return natija;
}

module.exports = envTekshir;
