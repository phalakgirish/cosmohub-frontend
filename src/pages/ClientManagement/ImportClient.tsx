import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import url from '../../env';  // Adjust the import path as necessary
import secureLocalStorage from 'react-secure-storage';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer , toast} from 'react-toastify';

// Define types
interface Client {
    client_name : string;
    client_dob : string; 
    client_mobile_number : string;
    client_gender: string;
    client_postaladdress: string;
    client_aadhar_number: string;
    sip_refered_by_clientId: string;
    sip_reference_level: string;
    client_country: string;
    client_state: string;
    client_city: string;
    client_status: string;
    branch_id: string;
}

interface DataResponse {
    // department: any;
    client: Client[];
}



const ImportClient = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [isRefreshed,setIsRefreshed] = useState(false)
    const[fileStatus,setFileStatus] = useState(false);
    const[errFile,setErrFile] = useState(false);
    var fileRecord = null;
    const[excelData,setExcelData] = useState([]);
    const[excelFileType,setExcelFileType] = useState(false);
    const[excelFile,setExcelFile] = useState(null);
    const[errmsg,setErrmsg] = useState(" ");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState<File | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isImported, setIsImported] = useState(false);
    // useEffect(() => {
    //     const bearerToken = secureLocalStorage.getItem('login');

    //     fetch(`${url.nodeapipath}/client`,{
    //         method:'GET',
    //         headers: {
    //             'Content-Type':'application/json',
    //             'Access-Control-Allow-Origin':'*',
    //             'Authorization': `Bearer ${bearerToken}`
    //             }
    //     })
    //         .then((response) => response.json())
    //         .then((data: DataResponse) => {
    //             // You can format data if needed
    //             console.log(data);
                
    //             const formattedData = data.client.map((client:any, index:any) => ({
    //                 srNo: index + 1,
    //                 ...client,
    //             }));
    //             setClients(formattedData);
    //         })
    //         .catch((error) => console.error('Error fetching client data:', error));
    // }, [isRefreshed]);


    const handleOpenDeleteModal = (id: string) => {
        setClientToDelete(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    const handleDelete = ()=>{
        if (!clientToDelete) return;
        
            const bearerToken = secureLocalStorage.getItem('login');
            try{
            fetch(`${url.nodeapipath}/client/${clientToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                }
            })
            .then((response) => response.json())
            .then((data) => {

                if (data.status) {
                    toast.success('Client deleted successfully');
                    // setIsRefreshed(prev => !prev);
                    setIsRefreshed(true)

                } else {
                    toast.error('Failed to delete client');
                }
            })
            .catch((error) => {
                // console.error('Error deleting SIP data:', error);
                toast.error('An error occurred while deleting the client');
            });
        }
        catch(error)
        {

        }finally{

        }
    }

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: clients.length,
        },
    ];

    const onVerify = (ev:any) =>{
        ev.preventDefault();
        if(clients.length >0)
        {
            const bearerToken = secureLocalStorage.getItem('login');
            fetch(`${url.nodeapipath}/client/verify-data`,{
                body: JSON.stringify(clients),
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                }
            })
            .then(res=>res.json())
            .then(result=>{
                // console.log(result);
                if(result.status === true)
                {  
                    setClients(result.client);  
                    setIsVerified(true)
                    setIsImported(false)
                }
            });
        }
        else
        {
            setErrmsg('Please Upload Data first.');
            setFile(null)
            handleOpenDeleteModal('1');
        }
    }

    var selectFile = (ev:any)=>{
        // console.log(ev.target.files[0]);
        setIsVerified(false)
        setIsImported(false)
        if(ev.target.files[0] === undefined || ev.target.files[0] === null)
        {
            setFileStatus(false);
        }
        else
        {
            setFile(ev.target.files[0]);
            setFileStatus(true);
            setErrFile(false);
            // setFileRecord(ev.target.files[0])
            fileRecord = ev.target.files[0]
            // console.log(fileRecord);
            
            const fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];

            if(fileTypes.includes(fileRecord.type))
            {
                setExcelFileType(true);
                // message.current.className = '';
                setErrmsg('');

                let reader = new FileReader();
                reader.readAsArrayBuffer(fileRecord);
                reader.onload = (ev:any) =>{
                    // console.log(ev.target);
                    // setExcelFile(ev.target.result);
                    // console.log(ev.target);

                    const workbook = XLSX.read(ev.target.result,{type:'buffer'});
                    // console.log(workbook);
                    const workSheetName = workbook.SheetNames[0];
                    // console.log(workSheetName);
                    const worksheet = workbook.Sheets[workSheetName];
                    // console.log(worksheet);
                    const data:any = XLSX.utils.sheet_to_json(worksheet);
                    // console.log(data);
                    // setExcelData(data);
                    const formattedData = data.map((client:any, index:any) => ({
                        srNo: index + 1,
                        client_name : client.client_name,
                        client_dob : client.client_dob, 
                        client_mobile_number : client.client_mobile_number,
                        client_gender: client.client_gender,
                        client_postaladdress: client.client_postaladdress,
                        client_aadhaar_number: client.client_aadhaar_number,
                        sip_refered_by_clientId: client.sip_refered_by_clientId,
                        sip_reference_level: client.sip_reference_level,
                        client_country: client.client_country,
                        client_state: client.client_state,
                        client_city: client.client_city,
                        client_status: (client.client_status == 'Active')?true:false,
                        branch_id: client.branch_id,
                    }));
                    setClients(formattedData)
                    setErrmsg('');
                };
            }
            else
            {
                setExcelFileType(false);
                // setExcelData(null);
                // message.current.className = 'alert alert-danger';
                setErrmsg('Please Select Only Excel File Types.');
                setFile(null)
                handleOpenDeleteModal('1');
            }
        }          
    }


    const onImport = (ev:any) =>{
        ev.preventDefault();
        if(!isImported)
        {
            if(isVerified)
            {
                const bearerToken = secureLocalStorage.getItem('login');
                fetch(`${url.nodeapipath}/client/import-data`,{
                    body: JSON.stringify(clients),
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }
                })
                .then(res=>res.json())
                .then(result=>{
                    // console.log(result);
                    if(result.status === true)
                    {  
                        setClients(result.client); 
                        setIsImported(true);   
                    }
                })
            }
            else
            {
                setErrmsg('Please Verify uploaded data.');
                handleOpenDeleteModal('1');
            }
        }
        else
        {
            setErrmsg('Uploaded Data Imported Already.');
            handleOpenDeleteModal('1');
        }    
    }


    const columns = [
        { Header: 'Sr. No', accessor: 'srNo',sort: true, },
        { Header: 'Name', accessor: 'client_name', sort: true,},
        { Header: 'Date Of Birth', accessor: 'client_dob', sort: true,},
        { Header: 'Mobile Number', accessor: 'client_mobile_number',sort: true, },
        { Header: 'Gender', accessor: 'client_gender',sort: true, },
        { Header: 'Address', accessor: 'client_postaladdress',sort: true, },
        { Header: 'Country', accessor: 'client_country',sort: true, },
        { Header: 'State', accessor: 'client_state',sort: true, },
        { Header: 'City/Village', accessor: 'client_city',sort: true, },
        { Header: 'Aadhaar Number', accessor: 'client_aadhaar_number',sort: true, },
        { Header: 'Referred By', accessor: 'sip_refered_by_clientId',sort: true, },
        { Header: 'Reference Level', accessor: 'sip_reference_level',sort: true, },
        {
            Header: 'Branch',
            accessor: 'branch_id',
            sort: true,
        },
        {
            Header: 'Verify Status',
            accessor: 'status',
            sort: true,
            Cell: ({ value }: { value: any })=>(value) ? 'Valid' : (value == 0)?'Invalid':''
        },
        {
            Header: 'Message',
            accessor: 'msg',
            sort: true,
        },
        
    ];

    const handleAddClient = ()=>{
        navigate('/client-registration');
    }

    const clearFile = () => {
        setFile(null)  
        setClients([]); 
        setIsVerified(false); 
        setIsImported(false); 
      };

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Import Clients</h4>
                                <p className="text-muted font-14 mb-4">A table showing all clients</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddClient}>
                                Add Client
                            </Button>
                        </div>
                        {/* <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.Header}>{column.Header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody> */}
                                {/* {clients.map((client, index) => (
                                    <tr key={client._id}>
                                        {columns.map((column) => (
                                            <td key={column.accessor}>
                                                {column.accessor === 'aadharFile' || column.accessor === 'panFile' ? (
                                                    <a href={client[column.accessor as keyof Client]} target="_blank" rel="noopener noreferrer">
                                                        View File
                                                    </a>
                                                ) : (
                                                    client[column.accessor as keyof Client]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))} */}
                                <div className="mb-1">
                                <Row>
                                    <div style={{width:"70%"}}>
                                        <Form.Group className="mb-2 d-flex">
                                            <Form.Label style={{width:'20%'}}>Upload File</Form.Label>
                                            <input type="file"  className="form-control" style={{ height: '38px'}} placeholder="Select Month" value={file ? undefined : ""} onChange={(e)=>{selectFile(e)}}/>
                                            <Button style={{ height: '38px', backgroundColor: '#f2f2f2',color:'#7e7e7e',border:'1px solid #7e7e7e' }} onClick={(e)=>clearFile()}>
                                                Clear
                                            </Button>
                                            <Form.Label style={{width:'48%',color:'#dd4923',paddingLeft:'8%',fontSize:'100%'}} onClick={(e)=>{window.location.href=`${url.nodeapipath}/sample/Import client.xlsx`}}><b>Sample Excel Format</b></Form.Label>
                                        </Form.Group>
                                    </div>
                                    <div style={{ textAlign:'end',width:"30%" }}>
                                        <Button style={{ height: '40px', backgroundColor: '#dd4923'}} onClick={(e)=>onVerify(e)}>
                                                Verify
                                        </Button>
                                        &nbsp;
                                        <Button style={{ height: '40px', backgroundColor: '#dd4923'}} onClick={(e)=>onImport(e)}>
                                                Import
                                        </Button>
                                    </div>
                                </Row>
                        </div>
                        <hr />
                        {(clients.length > 0)?
                            <Table
                            columns={columns}
                            data={clients}
                            // pageSize={5}
                            // sizePerPageList={sizePerPageList}
                            isSortable={true}
                            // pagination={true}
                            // isSearchable={true}
                            // isSelectable={true}
                            />
                        :'No Data Found'
                        }
                                    
                            {/* </tbody>
                        </Table> */}
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errmsg}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default ImportClient;
