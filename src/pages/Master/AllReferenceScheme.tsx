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
interface referenceScheme {
    _id: string;
    refScheme_name: string;
    refScheme_category: string;
    refScheme_amount: number;
    refScheme_comission: string;
    refScheme_status: boolean;
}

interface DataResponse {
    reference_scheme: referenceScheme[];
}

const AllReferenceScheme = () => {
    const [data, setData] = useState<referenceScheme[]>([]);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [schemeToDelete, setSchemeToDelete] = useState<string | null>(null);
    const [schemeDeleted,setSchemeDeleted] = useState(false)

    // Handle edit SIP
    const handleEdit = (id: string) => {
        navigate(`/edit-refscheme/${id}`);
    };

    // Handle opening of delete confirmation modal
    const handleOpenDeleteModal = (id: string) => {
        setSchemeToDelete(id);
        setShowDeleteModal(true);
    };

    // Handle closing of delete confirmation modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSchemeToDelete(null);
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
        if (!schemeToDelete) return;

        const bearerToken = secureLocalStorage.getItem('login');
        try {
            const response = await fetch(`${url.nodeapipath}/referencescheme/${schemeToDelete}`, {
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
                toast.success(result.message || 'Ref. Scheme deleted successfully');
                setSchemeDeleted(true)  

            } else {
                // console.error('Error deleting SIP:', result);
                toast.error('Failed to delete scheme');
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
        title: 'Reference Scheme',
        breadCrumbItems: [
            {
                path: '/all-refscheme',
                label: 'Reference Scheme',
                active: true,
            },
        ],
    });

    // Fetch SIPs data
    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchRefScheme = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/referencescheme?page=1`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }
                });
                const data: DataResponse = await response.json();

                
                if (response.ok) {
                    const formattedData = data.reference_scheme.map((scheme, index) => ({
                        srNo: index + 1,
                        _id: scheme._id,
                        refScheme_name: scheme.refScheme_name,
                        refScheme_category: scheme.refScheme_category,
                        refScheme_amount: scheme.refScheme_amount,
                        refScheme_comission: scheme.refScheme_comission,
                        refScheme_status: scheme.refScheme_status,
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching reference level:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchRefScheme();
    }, [schemeDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddRefScheme = () => {
        navigate('/add-refscheme');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Ref. Scheme Name',
            accessor: 'refScheme_name',
            sort: true,
        },
        {
            Header: 'Ref. Category',
            accessor: 'refScheme_category',
            sort: true,
        },
        {
            Header: 'Ref. Scheme Amount',
            accessor: 'refScheme_amount',
            sort: true,
        },
        {
            Header: 'Comission Type',
            accessor: 'refScheme_comission',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'refScheme_status',
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
                                <h4 className="header-title">All Reference Scheme</h4>
                                <p className="text-muted font-14 mb-4">A table showing all ref. scheme</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddRefScheme}>
                                Add Ref. Scheme
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
                    Are you sure you want to delete this reference scheme?
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

export default AllReferenceScheme;
