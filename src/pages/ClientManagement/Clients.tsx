import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import url from '../../env';  // Adjust the import path as necessary
import secureLocalStorage from 'react-secure-storage';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer , toast} from 'react-toastify';
import * as XLSX from 'xlsx';

// Define types
interface Client {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    postalAddress: string;
    landmark: string;
    aadharFile: string; // Assuming this is a URL or path
    panFile: string; // Assuming this is a URL or path
    createdAt: string; // Example date field
}

interface DataResponse {
    // department: any;
    client: Client[];
}



const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [clients1, setClients1] = useState<any[]>([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSelectDeleteModal, setShowSelectDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [isRefreshed,setIsRefreshed] = useState(false)
    const [isSelectedRec,setIsSelectedRec] = useState<Array<string>>([])

    const navigate = useNavigate();
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }
    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');

        fetch(`${url.nodeapipath}/client`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data: any) => {
                // You can format data if needed
                // console.log(data);
                
                const formattedData = data.client.map((client:any, index:any) => ({
                    srNo: index + 1,
                    ...client,
                }));
                setClients(formattedData);

                const formattedData1 = data.client1.map((client:any, index:any) => ({
                    srNo: index + 1,
                    client_id:client.client_id,
                    client_name:client.client_name,
                    client_dob:formatDate(new Date(client.client_dob)),
                    client_mobile_number:client.client_mobile_number,
                    client_emailId:(client.client_emailId == null)?"":client.client_emailId,
                    client_gender:client.client_gender,
                    client_aadhaar_number:client.client_aadhaar_number,
                    client_postaladdress:client.client_postaladdress,
                    client_landmark:client.client_landmark,
                    client_country:client.client_country,
                    client_state:client.client_state,
                    client_city:client.client_city,
                    client_bank_name:(client.client_bank_name== null)?"":client.client_bank_name,
                    client_bank_account_no:(client.client_bank_account_no== null)?"":client.client_bank_account_no,
                    client_bank_ifsc:(client.client_bank_ifsc== null)?"":client.client_bank_ifsc,
                    sip_reference_level:client.sip_reference_level,
                    referred_client_id:(client.sip_refered_by_clientId)?client.sip_refered_by_clientId.client_id:'',
                    referred_client_name:(client.sip_refered_by_clientId)?client.sip_refered_by_clientId.client_name:'',
                    status:(client.client_status)?'Active':'Inactive'   
                }));
                
                // console.log(formattedData1);
                
                setClients1(formattedData1);
            })
            .catch((error) => console.error('Error fetching client data:', error));
    }, [isRefreshed]);

    const handleEdit = (id:any)=>{
        navigate(`/edit-client/${id}`);
    };

    const handleOpenDeleteModal = (id: string) => {
        setClientToDelete(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    
    const handleOpenSelectDeleteModal = () => {
        setShowSelectDeleteModal(true);
    };

    const handleCloseSelectDeleteModal = () => {
        setShowSelectDeleteModal(false);
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
                    handleCloseDeleteModal()
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

    const handleSelectDelete = ()=>{
        // if (!clientToDelete) return;
        
            const bearerToken = secureLocalStorage.getItem('login');
            try{
                fetch(`${url.nodeapipath}/client/selected`, {
                    method: 'POST',
                    body:JSON.stringify(isSelectedRec),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }
                })
            .then((response) => response.json())
            .then((data) => {

                if (data.status) {
                    toast.success(data.msg);
                    // setIsRefreshed(prev => !prev);
                    
                    setIsRefreshed(true)
                    handleCloseSelectDeleteModal()
                    setIsSelectedRec([])

                } else {
                    toast.error(`Failed to delete client:${data.error}`);
                }
            })
            .catch((error) => {
                // console.error('Error deleting SIP data:', error);
                toast.error('An error occurred while deleting the client',error);
            });
        }
        catch(error)
        {

        }finally{

        }
    }

    const handleExportPayment = ()=>{
        if(clients1.length == 0)
            return;

        // var sipMembersfilesDetails = clients.filter((item:any)=>item._id == clientsName)
        exportToExcel(columns1,Excelcolumns,clients1,`Clients Data.xlsx`)
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

    const handelClientIdCheck = (e:any,id:any)=>{
        // console.log(e.target.checked);

        if(e.target.checked)
        {
            var selectedId = [...isSelectedRec];

            selectedId.push(id);

            setIsSelectedRec(selectedId);
        }
        else
        {
            var selectedId = [...isSelectedRec];

            selectedId = selectedId.filter(value => value !== id);

            setIsSelectedRec(selectedId)
        }
        
    }

    const handelAllClientIdCheck = (e:any)=>{
        
        if(e.target.checked)
            {
                var selectedId:any = [];
                
                clients.map((client:any)=>{
                    selectedId.push(client._id);
                })
                
                setIsSelectedRec(selectedId);
            }
            else
            {
                setIsSelectedRec([])
            }
    }

     const exportToExcel = (columns:any,columnHeader:any, data:any, fileName:any) => {
            // console.log(data);
            
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
        
            // Map the data to an array of objects with the specified column names
            const worksheetData = data.map((item:any) =>
                columns.reduce((acc:any, column:any) => {
                    acc[column.Header] = item[column.accessor];
                    return acc;
                }, {})
            );
        
            // Convert the data to a worksheet
            const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: columnHeader });
        
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
            // Generate Excel file and download it
            XLSX.writeFile(workbook, fileName);
        };

    const Excelcolumns = ['Sr. No','Client Id','Name','Date Of Birth','Mobile No','Email Id','Gender','Aadhaar Number','Postal Address','Landmark','Country','State','City/Village','Bank Name','Account Number','IFSC Code','SIP Reference Level','Referred By Client Id','Referred By Client Name','Status'];

    const columns1 = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Client Id',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'Name',
            accessor: 'client_name',
            sort: true,
        },
        {
            Header: 'Date Of Birth',
            accessor: 'client_dob',
            sort: true,
        },
        {
            Header: 'Mobile No',
            accessor: 'client_mobile_number',
            sort: true,
        },
        {
            Header: 'Email Id',
            accessor: 'client_emailId',
            sort: true,
        },
        {
            Header: 'Gender',
            accessor: 'client_gender',
            sort: true,
        },
        {
            Header: 'Aadhaar Number',
            accessor: 'client_aadhaar_number',
            sort: true,
        },
        {
            Header: 'Postal Address',
            accessor: 'client_postaladdress',
            sort: true,
        },
        {
            Header: 'Landmark',
            accessor: 'client_landmark',
            sort: true,
        },
        {
            Header: 'Country',
            accessor: 'client_country',
            sort: true,
        },
        {
            Header: 'State',
            accessor: 'client_state',
            sort: true,
        },
        {
            Header: 'City/Village',
            accessor: 'client_city',
            sort: true,
        },
        {
            Header: 'Bank Name',
            accessor: 'client_bank_name',
            sort: true,
        },
        {
            Header: 'Account Number',
            accessor: 'client_bank_account_no',
            sort: true,
        },
        {
            Header: 'IFSC Code',
            accessor: 'client_bank_ifsc',
            sort: true,
        },
        {
            Header: 'SIP Reference Level',
            accessor: 'sip_reference_level',
            sort: true,
        },
        {
            Header: 'Referred By Client Id',
            accessor: 'referred_client_id',
            sort: true,
        },
        {
            Header: 'Referred By Client Name',
            accessor: 'referred_client_name',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'status',
            sort: true,
        },
    ];

    const columns = [
        {
            Header: <>
            <Form.Check type="checkbox" id="default-checkbox1" checked={(isSelectedRec.length == clients.length)?true:false} onChange={(e)=>{handelAllClientIdCheck(e)}}/>
        </>,
            accessor: ' ',
            sort: false, 
            Cell: ({ row }: { row: any }) => (
                 <>
                    <Form.Check type="checkbox" id="default-checkbox1" checked={(isSelectedRec.indexOf(row.original._id) == -1)?false:true} onChange={(e)=>{handelClientIdCheck(e,row.original._id)}}/>
                </>
            ),
        },
        { Header: 'Sr. No', accessor: 'srNo',sort: true, },
        { Header: 'Client Id', accessor: 'client_id',sort: true, },
        { Header: 'Name', accessor: 'client_name', sort: true,},
        { Header: 'Email', accessor: 'client_emailId',sort: true, },
        { Header: 'Mobile Number', accessor: 'client_mobile_number',sort: true, },
        // { Header: 'Postal Address', accessor: 'postalAddress',sort: true, },
        // { Header: 'Landmark', accessor: 'landmark',sort: true, },
        {
            Header: 'Status',
            accessor: 'client_status',
            sort: true,
            Cell: ({ value }: { value: boolean }) => (value ? 'Active' : 'Inactive'),
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            sort: true,
            Cell: ({ row }: { row: any }) => (
                 <>
                 <Button
                     variant="primary"
                     onClick={() => handleEdit(row.original._id)}
                     style={{borderRadius: '35px',
                         width: '38px',
                         padding: '7px 7px'}}
                 >
                      <i className='fe-edit-2'/>
                 </Button>
                 &nbsp;
                 <Button
                 variant="danger"
                 onClick={() => handleOpenDeleteModal(row.original._id)}
                 style={{borderRadius: '35px',
                     width: '38px',
                     padding: '7px 7px'}}
                 >
                 <i className='fe-trash-2'/> 
             </Button>
         </>
            ),
        },
    ];

    const handleAddClient = ()=>{
        navigate('/client-registration');
    }

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Client</h4>
                                <p className="text-muted font-14 mb-4">A table showing all clients</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddClient}>
                                Add Client
                            </Button>
                        </div>

                        <Button
                            variant="success"
                            onClick={() => handleExportPayment()}
                            style={{
                                width: '101px',
                                padding: '7px 7px',position:'absolute',right:'1.6%'}}
                            >
                            Export
                        </Button>
                        { (isSelectedRec.length >0) &&
                        <Button
                            variant="danger"
                            onClick={() => handleOpenSelectDeleteModal()}
                            style={{borderRadius: '35px',
                                width: '38px',
                                padding: '7px 7px',position:'absolute',right:'10.6%'}}
                            >
                            <i className='fe-trash-2'/> 
                        </Button>}
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
                                    <Table
                                    columns={columns}
                                    data={clients}
                                    pageSize={5}
                                    sizePerPageList={sizePerPageList}
                                    isSortable={true}
                                    pagination={true}
                                    isSearchable={true}
                                    // isSelectable={true}
                                    />
                            {/* </tbody>
                        </Table> */}
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this client?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showSelectDeleteModal} onHide={handleCloseSelectDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this selected clients?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSelectDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSelectDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default Clients;
