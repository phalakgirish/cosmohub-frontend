import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

// hooks
import { usePageTitle } from '../../../hooks';
import url from '../../../env';

// component
import Table from '../../../components/Table';
import secureLocalStorage from 'react-secure-storage';

// Define types
interface SIP {
    _id: string;
    sipmember_nominee_name: string;
    sipmember_id: string;
    client_id: string;
    sipmember_name: string;
    sipmember_bank_name: string;
}

interface DataResponse {
    sip: SIP[];
}

const AllSIPManagement = () => {
    const [data, setData] = useState<SIP[]>([]);
    const navigate = useNavigate();

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-sip/${id}`);
    };

    const handleDelete = async (id: string) => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/sip/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Optionally refresh data after deletion
            setData(data.sip.map((sip: SIP) => ({
                ...sip,
                srNo: data.sip.indexOf(sip) + 1
            })));
        })
        .catch((error) => console.error('Error deleting SIP data:', error));
    };

    // Set page title
    usePageTitle({
        title: 'SIP Registrations',
        breadCrumbItems: [
            {
                path: '/sip-management',
                label: 'SIP Management',
                active: true,
            },
        ],
    });

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/sip/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then((response) => response.json())
        .then((data: DataResponse) => {
            const formattedData = data.sip.map((sip, index) => ({
                srNo: index + 1,
                ...sip,
            }));
            setData(formattedData);
        })
        .catch((error) => console.error('Error fetching SIP data:', error));
    }, []);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddSIP = () => {
        navigate('/add-sip');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Nominee Name',
            accessor: 'sipmember_nominee_name',
            sort: true,
        },
        {
            Header: 'SIP ID',
            accessor: 'sipmember_id',
            sort: true,
        },
        {
            Header: 'Client ID',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'SIP Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Bank Name',
            accessor: 'sipmember_bank_name',
            sort: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <>
                    <Button
                        variant="primary"
                        onClick={() => handleEdit(row.original._id)}
                    >
                        Edit
                    </Button>
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

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">SIP Registrations</h4>
                                <p className="text-muted font-14 mb-4">A table showing all SIP registrations</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddSIP}>
                                Add SIP
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default AllSIPManagement;
