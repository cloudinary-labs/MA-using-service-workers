
const images = [
  'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wikipedia_mini_globe_handheld.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Carl_Friedrich_Gauss.jpg/340px-Carl_Friedrich_Gauss.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/BBH_gravitational_lensing_of_gw150914.webm/266px--BBH_gravitational_lensing_of_gw150914.webm.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Spacetime_lattice_analogy.svg/440px-Spacetime_lattice_analogy.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2014.03.09.-23-Kaefertaler_Wald-Mannheim-Fruehlings-Scharbockskraut.jpg/1000px-2014.03.09.-23-Kaefertaler_Wald-Mannheim-Fruehlings-Scharbockskraut.jpg'
];



function addImage() {
  console.log('CliCk');

  const img = document.createElement('img');
  img.src = images.pop();
  document
    .getElementById('image-container')
    .appendChild(img)
}
