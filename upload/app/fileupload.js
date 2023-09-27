import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; 
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [workbookData, setWorkbookData] = useState(null);
    const [uploadedData, setUploadedData] = useState([]);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);

        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            const bstr = e.target.result;
            const workbook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            setWorkbookData(workbook);
        };

        if (rABS) {
            reader.readAsBinaryString(event.target.files[0]); // Use the file from the event directly
        } else {
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (workbookData) {
            const data = extractDataFromWorkbook(workbookData);
            setUploadedData(data);
        }
    }, [workbookData]);

    const extractDataFromWorkbook = (workbook) => {
        const data = [];
        workbook.SheetNames.forEach((sheetName) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            sheetData.forEach((row) => {
                if (row.length >= 5) {
                    data.push({
                        city_name: row[0],
                        candidates_name: row[1],
                        contact_number: row[2],
                        email: row[3],
                        lecture_mode: row[4],
                    });
                }
            });
        });
        return data;
    }

    const uploadDataToServer = (data) => {
        axios.post('/api/upload-data', { data })
            .then(response => {
                console.log('Data uploaded to server successfully:', response);
            })
            .catch(error => {
                console.error('Error uploading data to server:', error);
            });
    };

    const handleUploadClick = () => {
        console.log('Button Clicked'); // Debugging log
        
        if (uploadedData.length > 0) {
            console.log('Uploading Data:', uploadedData); // Debugging log
            uploadDataToServer(uploadedData);
        } else {
            console.error('No Data to Upload'); // Debugging log
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={onFileChange} />
            <button className="btnthem btnright" onClick={handleUploadClick} disabled={!selectedFile}>
                Next
            </button>
            <div className="data">
                {uploadedData.map((data, index) => (
                    <div key={index}>
                        <div>City Name: {data.city_name}</div>
                        <div>Candidate Name: {data.candidates_name}</div>
                        <div>Contact Number: {data.contact_number}</div>
                        <div>Email: {data.email}</div>
                        <div>Lecture Mode: {data.lecture_mode}</div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
