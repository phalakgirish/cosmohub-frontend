import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Define types
interface Branch {
    _id: string;
    branch_contact_person: string;
    branch_mobile_number: string;
    branch_emailId: string;
    branch_address: string;
    branch_city: string;
    branch_district: string;
    branch_taluka: string;
    branch_status: boolean;
}

interface DataResponse {
    branch: Branch[];
}

const Branch = () => {
    const [data, setData] = useState<any[]>([]);
    const [isRefreshed,setIsRefreshed] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-branch/${id}`);
    };

     // Handle opening of delete confirmation modal
     const handleOpenDeleteModal = (id: string) => {
        setBranchToDelete(id);
        setShowDeleteModal(true);
    };

    // Handle closing of delete confirmation modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setBranchToDelete(null);
    };

    const handleDelete = async () =>{
        if (!branchToDelete) return;
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/branch/${branchToDelete}`,{
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                    if (data.status) {
                        toast.success('Branch deleted successfully');
                        setIsRefreshed(prev => !prev);
                    } else {
                        toast.error('Failed to delete branch');
                    }
                // setIsRefreshed(true)
            })
            .catch((error) => {console.error('Error fetching branch data:', error)
                toast.error('An error occurred while deleting the client');
            });
            handleCloseDeleteModal();
    
}

    // Set page title
    usePageTitle({
        title: 'Branch',
        breadCrumbItems: [
            {
                path: '/branch',
                label: 'Branch',
                active: true,
            },
        ],
    });

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/branch/`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data: DataResponse) => {
                // console.log(data);
                const formattedData = data.branch.map((branch, index) => ({
                    srNo: index + 1,
                    ...branch,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error('Error fetching branch data:', error));
    }, [isRefreshed]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddBranch = () => {
        navigate('/add-branch');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Branch Code',
            accessor: 'branch_code',
            sort: true,
        },
        {
            Header: 'Branch Name',
            accessor: 'branch_name',
            sort: true,
        },
        {
            Header: 'Contact Person',
            accessor: 'branch_contact_person',
            sort: true,
        },
        {
            Header: 'Mobile Number',
            accessor: 'branch_mobile_number',
            sort: true,
        },
        // {
        //     Header: 'Email ID',
        //     accessor: 'branch_emailId',
        //     sort: true,
        // },
        {
            Header: 'City',
            accessor: 'branch_city',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'branch_status',
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
                                <h4 className="header-title">Branch</h4>
                                <p className="text-muted font-14 mb-4">A table showing all branches</p>
                            </div>
                            <Button style={{height:'40px', backgroundColor:'#dd4923'}} onClick={handleAddBranch}>
                                Add Branch
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
                    Are you sure you want to delete this branch?
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

export default Branch;
