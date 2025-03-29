import dotenv from 'dotenv';
dotenv.config(); // Must be first
import ImageKit from "imagekit";

//     const imagekit = new ImageKit({
//         urlEndpoint: process.env.IK_URL_ENDPOINT,
//         publicKey: process.env.IK_PUBLIC_KEY,
//         privateKey: process.env.IK_PRIVATE_KEY,
//       });


//   export default imagekit


console.log('Public Key:', process.env.IMAGEKIT_PUBLIC_KEY);
console.log('Private Key:', process.env.IMAGEKIT_PRIVATE_KEY);
console.log('URL Endpoint:', process.env.IMAGEKIT_URL_ENDPOINT);

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

  

export default imagekit