import React, { useState } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workbookData, setWorkbookData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          setWorkbookData(workbook);
        } catch (error) {
          console.error("Error reading the file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setSelectedFile(null);
      setWorkbookData(null);
    }
  };

  const isValidFileType = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return allowedTypes.includes(file.type);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getColumnData = (sheetData, columnIndex) => {
    return sheetData.map((row) => row[columnIndex]);
  };

  return (
    <div>
      <div className="modalborder">
        <div className="uploadfilebox">
          <div className="uploadfileboxinside">
            <div className="file-upload-wrapper">
              {selectedFile && (
                <span className="selected-file-name">{selectedFile.name}</span>
              )}
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                id="hiddenFileInput"
                style={{ display: "none" }}
              />
              <label
                htmlFor="hiddenFileInput"
                className="custom-file-upload-button btnthem"
              >
                Upload File
              </label>
            </div>
          </div>
        </div>
      </div>
      <button className="btnthem btnright" onClick={openModal} disabled={!selectedFile}>
        Next
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Upload File Modal"
      >
        <div className="">
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
          <h4>Data</h4>
          <div className="data">
            {workbookData &&
              workbookData.SheetNames.map((sheetName) => (
                <div key={sheetName}>
                  <h5>{sheetName}</h5>
                  {XLSX.utils.sheet_to_json(workbookData.Sheets[sheetName], {
                    header: 1,
                  }).length > 0 &&
                    XLSX.utils
                      .sheet_to_json(workbookData.Sheets[sheetName], {
                        header: 1,
                      })[0]
                      .map((_, columnIndex) => (
                        <div key={columnIndex}>
                          {getColumnData(
                            XLSX.utils.sheet_to_json(
                              workbookData.Sheets[sheetName],
                              { header: 1 }
                            ),
                            columnIndex
                          ).map((cellData, rowIndex) => (
                            <div key={rowIndex}>{cellData}</div>
                          ))}
                          <hr />
                        </div>
                      ))}
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileUpload;