import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types for SIP data
interface SIP {
    _id: string;
    sip_name: string;
    sip_amount: number;
    sip_duration: number;
    sip_type: string;
    sip_status: boolean;
}

interface DataResponse {
    sips: SIP[];
}

const SIPs = () => {
    const [data, setData] = useState<SIP[]>([]);
    const navigate = useNavigate();
    const [sipDeleted,setSipDeleted] = useState(false)

    // Handle edit SIP
    const handleEdit = (id: string) => {
        navigate(`/edit-slab/${id}`);
    };

    // Handle delete SIP
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this SIP Slab?");
        if (confirmed) {
        const bearerToken = secureLocalStorage.getItem('login');
        try {
            const response = await fetch(`${url.nodeapipath}/sipslab/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                // setData(data.filter(sip => sip._id !== id)); // Remove deleted SIP from state
                // console.log('SIP deleted successfully:', result);
                toast.success(result.message || 'SIP Slab deleted successfully');
                setSipDeleted(true)  

            } else {
                // console.error('Error deleting SIP:', result);
                toast.error('Failed to delete SIP');
                }
            } catch (error) {
                // console.error('Error during API call:', error);
                toast.error('An error occurred while deleting the SIP');
            }
        }
    };

    // Set page title
    usePageTitle({
        title: 'SIP Slabs',
        breadCrumbItems: [
            {
                path: '/sips',
                label: 'SIPs',
                active: true,
            },
        ],
    });

    // Fetch SIPs data
    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchSIPs = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/sipslab/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }
                });
                const data: DataResponse = await response.json();
                // console.log(data);
                
                if (response.ok) {
                    const formattedData = data.sips.map((sip, index) => ({
                        srNo: index + 1,
                        ...sip,
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching SIPs:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchSIPs();
    }, [sipDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddSIP = () => {
        navigate('/add-slab');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Duration (in months)',
            accessor: 'duration',
            sort: true,
        },
        {
            Header: 'Rank',
            accessor: 'rank',
            sort: true,
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sort: true,
        },

        {
            Header: 'Type',
            accessor: 'type',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'sip_status',
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
                    style={{borderRadius: '35px',
                        width: '38px',
                        padding: '7px 7px'}}
                >
                     <i className='fe-edit-2'/>
                </Button>
                &nbsp;
                <Button
                variant="danger"
                onClick={() => handleDelete(row.original._id)}
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

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All SIP Slabs</h4>
                                <p className="text-muted font-14 mb-4">A table showing all SIP slabs</p>
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
            <ToastContainer />
        </Row>
    );
};

export default SIPs;
