import { useState, useEffect } from 'react';
import FileUpload from '@/component/FileUpload';
import PDFViewer from '@/component/PDFViewer';
import OpenPDFLink from '@/component/OpenPdfLink';
import { uploadPDF } from '@/axios/axios';
import ChatModal from '@/component/ChatModel';

export default function Home() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (!file || !name) {
      alert("Please upload a PDF file and enter your name.");
      return;
    }

    setLoading(true);

    const promptData = { prompt: name };

    try {
      const response = await uploadPDF(file, promptData);

      if (response && response.response) {
        setResponseMessage(response.response);

        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: name, sender: 'user' },
          { text: response.response, sender: 'system' }
        ]);
      } else {
        console.error("API response structure is invalid:", response);
        setResponseMessage("Error: Invalid response from API.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponseMessage("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const startChat = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-xl w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        {!file ? (
          <FileUpload handleFileChange={handleFileChange} />
        ) : (
          <>
            <PDFViewer file={fileURL} />
            {!responseMessage && !modalOpen && (
              <div className="w-full flex flex-col items-center space-y-4">
                <label className="form-control items-center mt-3 mb-3 w-full" >
                  <span className="label-text">What do you want to ask?</span>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={handleNameChange}
                  />
                </label>
                <button
                  className="btn btn-primary w-full max-w-xs"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Start"}
                </button>
              </div>
            )}

            <OpenPDFLink openPDFInNewWindow={() => window.open(fileURL, '_blank', 'fullscreen=yes')} />
          </>
        )}

        {responseMessage && !modalOpen && (
          <div className="w-full flex flex-col items-center space-y-4">
            <div role="alert" class="alert shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info h-6 w-6 shrink-0">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">Aİ Message!</h3>
                <div class="text-xs text-success">{responseMessage}</div>
              </div>
            </div>
            <button className="btn btn-success" onClick={startChat}>
              Start Chat
            </button>
          </div>
        )}

        {modalOpen && (
          <ChatModal
            file={file}
            initialMessages={chatMessages}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
