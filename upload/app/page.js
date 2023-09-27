"use client";
import React, { useState } from "react";
import FileUpload from "./fileupload";
import Modal from "react-modal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    content: {
      width: "80%",
      height: "70%",
      margin: "auto",
      overflowY: "auto",

      "@media (max-width: 800px)": {
        width: "90%",
        height: "80%",
      },

      "@media (max-width: 500px)": {
        width: "100%",
        height: "100%",
      },
    },
  };

  return (
    <>
      <button className="btnthem" onClick={openModal}>
        Upload File
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Upload File Modal"
        style={customStyles}
      >
        <div className="modalSpace">
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
          <h3 className="titledesign">Upload file</h3>
          <h4 className="myh4">Select Source</h4>
          <select className="mySelect">
            <option value="insta/FB">insta/FB</option>
            <option value="Google">Google</option>
            <option value="College">College</option>
            <option value="Naukri">Naukri</option>
          </select>
          <h4 className="myh4">Upload file</h4>
          <FileUpload />
        </div>
      </Modal>
    </>
  );
}
