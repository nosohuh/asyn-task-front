import axios from "axios";

// Axios instance oluşturma
const HTTP = axios.create({
  baseURL: "http://127.0.0.1:8000/",  
  withCredentials: true,
});

export const uploadPDF = async (file, promptData) => {
  if (!file) {
    throw new Error("Lütfen bir PDF dosyası seçin.");
  }
  const formData = new FormData();
  formData.append("file", file);
  for (const [key, value] of Object.entries(promptData)) {
    formData.append(key, value);
  }
  try {
    const response = await HTTP.post("/pdf/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    console.error("PDF yükleme hatası:", error.response?.data || error.message);
    throw error;
  }
};

export const sendChatRequest = async (file, userInput) => {
  if (!file || !userInput) {
    throw new Error("Hem dosya hem de kullanıcı mesajı gereklidir.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_input", userInput);
  try {
    const response = await HTTP.post("/chat/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Chat gönderim hatası:", error.response?.data || error.message);
    throw error;
  }
};

export const endChat = async (file) => {
  if (!file) { 
    throw new Error("Dosya yolu gerekli");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_input", "Closed");
  try {
    const response = await HTTP.post("/end-chat/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data;
  } catch (error) {
    console.error("Chat gönderim hatası:", error.response?.data || error.message);
    throw error;
  }
};

export default HTTP;
