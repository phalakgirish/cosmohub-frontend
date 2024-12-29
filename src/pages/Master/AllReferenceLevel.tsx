import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types for SIP data
interface ReferenceLevel {
    _id: string;
    reference_level: number;
    reference_bouns: number;
    reference_effective: string;
    reference_status: boolean;
}

interface DataResponse {
    reference_levels: ReferenceLevel[];
}

const ReferenceLevels = () => {
    const [data, setData] = useState<ReferenceLevel[]>([]);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [levelToDelete, setLevelToDelete] = useState<string | null>(null);
    const [levelDeleted,setLevelDeleted] = useState(false)

    // Handle edit SIP
    const handleEdit = (id: string) => {
        navigate(`/edit-referencelevel/${id}`);
    };

    // Handle opening of delete confirmation modal
    const handleOpenDeleteModal = (id: string) => {
        setLevelToDelete(id);
        setShowDeleteModal(true);
    };

    // Handle closing of delete confirmation modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setLevelToDelete(null);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }

    // Handle delete SIP
    const handleDelete = async () => {
        if (!levelToDelete) return;

        const bearerToken = secureLocalStorage.getItem('login');
        try {
            const response = await fetch(`${url.nodeapipath}/referencelevel/${levelToDelete}`, {
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
                toast.success(result.message || 'Reference Level deleted successfully');
                setLevelDeleted(true)  

            } else {
                // console.error('Error deleting SIP:', result);
                toast.error('Failed to delete SIP');
                }
            } catch (error) {
                // console.error('Error during API call:', error);
                toast.error('An error occurred while deleting the SIP');
            }finally{
                handleCloseDeleteModal();
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
        const fetchReferenceLevel = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/referencelevel?page=1`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }
                });
                const data: DataResponse = await response.json();

                
                if (response.ok) {
                    const formattedData = data.reference_levels.map((referencelevel, index) => ({
                        srNo: index + 1,
                        _id: referencelevel._id,
                        reference_level: referencelevel.reference_level,
                        reference_bouns: referencelevel.reference_bouns,
                        reference_effective: formatDate(new Date(referencelevel.reference_effective)),
                        reference_status: referencelevel.reference_status
                        
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching reference level:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchReferenceLevel();
    }, [levelDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddReferenceLevel = () => {
        navigate('/add-referencelevel');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Reference Level',
            accessor: 'reference_level',
            sort: true,
        },
        {
            Header: 'Reference Bouns (in %)',
            accessor: 'reference_bouns',
            sort: true,
        },

        {
            Header: 'Effective Date',
            accessor: 'reference_effective',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'reference_status',
            sort: true,
            Cell: ({ value }: { value: boolean }) => (value ? 'Active' : 'Inactive'),
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

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All Reference Level</h4>
                                <p className="text-muted font-14 mb-4">A table showing all reference level</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddReferenceLevel}>
                                Add Level
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this reference level?
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
        </Row>
    );
};

export default ReferenceLevels;
