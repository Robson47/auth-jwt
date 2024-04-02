/*
const {initializeApp} = require("firebase/app");
const {getStorage, ref, deleteObject} = require("firebase/storage");
require("dotenv").config();
const firebaseConfig = {...};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

const deleteImage = async (image) => {
    const deleteRef = ref(storage, image);
    try{
        deleteObject(deleteRef);
        console.log("imagem excluida com sucesso");
    }catch(error){
        console.error(error);
    };
};

module.exports = deleteImage;
*/