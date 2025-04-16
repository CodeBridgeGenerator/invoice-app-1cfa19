import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import excelLogo from '../assets/media/excelLogo.svg';
import client from "./restClient";
import * as XLSX from 'xlsx';

export default function UploadService({ serviceName, user,onUploadComplete, disabled }) {
    const fileUploadRef = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [serviceFields, setServiceFields] = useState([]);
    const [requiredFields, setRequiredFields] = useState([]);
    const toast = useRef(null);


    useEffect(() => {
        async function fetchServiceFields() {
            try {
                const schema = await _getSchema(serviceName); 
                setServiceFields(Object.keys(schema.fields));
            } catch (error) {
                console.error('Failed to fetch service schema:', error);
            }
        }
    
        fetchServiceFields();
    }, [serviceName]);
    

    const onTemplateSelect = (e) => {
        try {
            let _totalSize = totalSize;
            let files = e.files;

            Object.keys(files).forEach((key) => {
                _totalSize += files[key].size || 0;
            });

            setTotalSize(_totalSize);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to calculate total size'
            });
        }
    };

    const onTemplateUpload = (e) => {
        try {
            let _totalSize = 0;

            e.files.forEach((file) => {
                _totalSize += file.size || 0;
            });

            setTotalSize(_totalSize);
            toast.current.show({
                severity: 'info',
                summary: 'Success',
                detail: 'File Uploaded'
            });

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to upload file'
            });

        }
    };

    const onTemplateRemove = (file, callback) => {
        try {
            setTotalSize(totalSize - file.size);
            callback();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove file'
            });
        }
    };

    const onTemplateClear = () => {
        try {
            setTotalSize(0);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to clear files'
            });
        }
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formattedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div
                className={className}
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formattedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt="Excel Icon" src={excelLogo} width={50} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>

                <div className="ml-auto flex align-items-center">
                    <Tag value={props.formatSize} severity="warning" className="px-3 py-2 mr-3" />
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger" onClick={() => onTemplateRemove(file, props.onRemove)} />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i
                    className="pi pi-file-excel mt-3 p-5"
                    style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)'
                    }}
                ></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Excel File Here
                </span>
            </div>
        );
    };

    const customBase64Uploader = async (event) => {
        try {
            const file = event.files[0];
            if (!file) throw new Error('No file selected');
    
            const reader = new FileReader();
            const blob = await fetch(file.objectURL).then(r => r.blob());
            reader.readAsDataURL(blob);
    
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];
                const wb = XLSX.read(base64data, { type: 'base64' });
                const worksheets = [];
                const failRecords = [];
                let successCount = 0;
    
                for (let i in wb.SheetNames) {
                    const wsname = wb.SheetNames[i];
                    const ws = wb.Sheets[wsname];
                    let data = XLSX.utils.sheet_to_json(ws);
    
                    data.forEach((row, i) => {
                        const hasAllFields = serviceFields.every(field => field in row);
                        const hasRequiredFields = requiredFields.every(field => row[field] !== undefined && row[field] !== null);
    
                        if (!hasAllFields || !hasRequiredFields) {
                            failRecords.push({
                                id: i,
                                errorMessage: 'Missing fields or required fields not provided'
                            });
                        }
                    });
    
                    data = data.map(item => ({
                        ...item,
                        createdBy: user?._id,
                        updatedBy: user?._id
                    }));
    
                    worksheets.push({ sheet: wsname, data });
                }
    
                const promises = worksheets[0].data.map(async record => {
                    try {
                        await client.service(serviceName).create(record);
                        successCount++;
                    } catch (error) {
                        failRecords.push({
                            id: record.id,
                            errorMessage: error.message
                        });
                    }
                });
    
                await Promise.all(promises);
    
                toast.current.show({
                    severity: 'info',
                    summary: 'Upload Summary',
                    detail: `${successCount} records succeeded, ${failRecords.length} records failed`
                });
    
                if (failRecords.length > 0) {
                    await sendFailedRecordEmail(failRecords);
    
                    toast.current.show({
                        severity: 'success',
                        summary: 'Email Sent',
                        detail: 'A confirmation email has been sent with the failed records.'
                    });
                }
    
                // Delay the closing of the dialog box to ensure toast notifications are shown
                setTimeout(() => {
                    if (onUploadComplete) {
                        onUploadComplete();
                    }
                }, 2000); // Adjust the delay time as needed
            };
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'An error occurred during file upload'
            });
    
            // Delay the closing of the dialog box in case of an error
            setTimeout(() => {
                if (onUploadComplete) {
                    onUploadComplete();
                }
            }, 2000); // Adjust the delay time as needed
        }
    };
    

    const sendFailedRecordEmail = async (failedRecords) => {
        const failedRecordDetails = failedRecords.map(record => ({
            // id: record.id,
            reason: record.errorMessage || 'No reason provided'
        }));
    
        // Prepare the error messages as a single string to be passed to the email template
        const errorMessages = failedRecordDetails.map(record => `- Error: ${record.reason}`).join('\n');
    
        // Convert failedRecordDetails to Excel (optional)
        const ws = XLSX.utils.json_to_sheet(failedRecordDetails);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'FailedRecords');
    
        // Generate Excel file as Blob
        const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    
        // Convert Blob to Base64 using FileReader
        const reader = new FileReader();
        reader.readAsDataURL(excelBlob);
    
        reader.onloadend = async function () {
            const base64ExcelFile = reader.result.split(',')[1];  // Extract Base64 data from Data URL
    
            // Define the attachments array (optional for sending Excel file)
            const attachments = [
                {
                    filename: 'failed_records.xlsx',
                    content: base64ExcelFile,  // Attach the Excel file as base64
                    encoding: 'base64',
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Set MIME type
                }
            ];
    
            console.log("upload service failedRecordDetails : ", failedRecordDetails);
    
            const _mail = {
                name: "onFailedRecordNotification",
                type: "notification",
                from: "info@cloudbasha.com", 
                recipients: [user.email], 
                data: { 
                    recipientName: "Admin",
                    timestamp: new Date().toISOString(),
                    failedRecordDetails: errorMessages  // Pass the error message string
                },
                subject: "Failed Records Notification",
                templateId: "onFailedRecordNotification",
                attachments: attachments // Optional: include attachments if they exist
            };
    
            try {
                await client.service("mailQues").create(_mail);
                console.log("Failed records email sent successfully with attachment.");
            } catch (error) {
                console.error("Error sending failed records email:", error);
            }
        };
    
        reader.onerror = (error) => {
            console.error("FileReader error:", error);
        };
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast}></Toast>

            <div>
                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <FileUpload
                    ref={fileUploadRef}
                    name="demo[]"
                    url="/api/upload"
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    maxFileSize={25000000} // 1 MB
                    onUpload={onTemplateUpload}
                    onSelect={onTemplateSelect}
                    onError={onTemplateClear}
                    onClear={onTemplateClear}
                    headerTemplate={headerTemplate}
                    itemTemplate={itemTemplate}
                    emptyTemplate={emptyTemplate}
                    chooseOptions={{
                        icon: 'pi pi-fw pi-file',
                        iconOnly: true,
                        className: 'custom-choose-btn p-button-rounded p-button-outlined'
                    }}
                    uploadOptions={{
                        icon: 'pi pi-fw pi-cloud-upload',
                        iconOnly: true,
                        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
                    }}
                    cancelOptions={{
                        icon: 'pi pi-fw pi-times',
                        iconOnly: true,
                        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
                    }}
                    customUpload
                    uploadHandler={customBase64Uploader}
                    disabled={disabled ? disabled : false}
                />
            </div>
        </div>
    );
}
