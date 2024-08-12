import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import url from '../../env';  // Adjust the import path as necessary
import secureLocalStorage from 'react-secure-storage';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';

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
    const [isRefreshed,setIsRefreshed] = useState(false)
    const navigate = useNavigate();
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
            .then((data: DataResponse) => {
                // You can format data if needed
                console.log(data);
                
                const formattedData = data.client.map((client:any, index:any) => ({
                    srNo: index + 1,
                    ...client,
                }));
                setClients(formattedData);
            })
            .catch((error) => console.error('Error fetching client data:', error));
    }, [isRefreshed]);

    const handleEdit = (id:any)=>{
        navigate(`/edit-client/${id}`);
    };

    const handleDelete = (id:any)=>{
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/client/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {

            setIsRefreshed(true)
        })
        .catch((error) => console.error('Error deleting SIP data:', error));
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

    const columns = [
        { Header: 'Sr. No', accessor: 'srNo',sort: true, },
        { Header: 'Client Id', accessor: 'client_id',sort: true, },
        { Header: 'Name', accessor: 'client_name', sort: true,},
        { Header: 'Email', accessor: 'client_emailId',sort: true, },
        { Header: 'Mobile Number', accessor: 'client_mobile_number',sort: true, },
        // { Header: 'Postal Address', accessor: 'postalAddress',sort: true, },
        // { Header: 'Landmark', accessor: 'landmark',sort: true, },
        {
            Header: 'Actions',
            accessor: 'actions',
            sort: true,
            Cell: ({ row }: { row: any }) => (
                <>
                <Button
                    variant="primary"
                    onClick={() => handleEdit(row.original._id)}
                >
                    Edit
                </Button>
                &nbsp;
                <Button
                    variant="danger"
                    onClick={() => handleDelete(row.original._id)}
                >
                    Delete
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
                                    />
                            {/* </tbody>
                        </Table> */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Clients;
