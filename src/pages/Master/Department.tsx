import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface Department {
    _id: string;
    department_name: string;
    department_desc: string;
    department_status: boolean;
}

interface DataResponse {
    // department: any;
    department: Department[];
}


const Department = () => {
    const [data, setData] = useState<any[]>([]);
    const [isRefreshed,setIsRefreshed] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleEdit = (id: string) => {
        navigate(`/edit-department/${id}`);
    };

    // Handle opening of delete confirmation modal
    const handleOpenDeleteModal = (id: string) => {
        setDepartmentToDelete(id);
        setShowDeleteModal(true);
    };

    // Handle closing of delete confirmation modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDepartmentToDelete(null);
    };

    const handleDelete = async () =>{
        if (!departmentToDelete) return;
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/department/${departmentToDelete}`,{
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);d
                if (data.status) {
                    toast.success('Department deleted successfully');
                    setIsRefreshed(true)
                }
                else {
                    toast.error('Failed to delete department');
                }
            })
            .catch((error) => {
                // console.error('Error fetching branch data:', error)
                toast.error('An error occurred while deleting the department',error);
            });
            handleCloseDeleteModal();
    }

    // Set page title
    usePageTitle({
        title: 'Department',
        breadCrumbItems: [
            {
                path: '/department',
                label: 'Department',
                active: true,
            },
        ],
    });

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/department/`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data: DataResponse) => {
                console.log(data);
                const formattedData = data.department.map((department: any, index: number) => ({
                    srNo: index + 1,
                    ...department,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error('Error fetching department data:', error));
    }, [isRefreshed]);

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
            value: data.length,
        },
    ];

    const handleAddDepartment = () => {
        window.location.href = '/add-department';
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Department Name',
            accessor: 'department_name',
            sort: true,
        },
        {
            Header: 'Branch Name',
            accessor: 'branch_name',
            sort: true
        },
        {
            Header: 'Status',
            accessor: 'department_status',
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
                                <h4 className="header-title">Department</h4>
                                <p className="text-muted font-14 mb-4">A table showing all departments</p>
                            </div>
                            <Button style={{height:'40px', backgroundColor:'#dd4923'}} onClick={handleAddDepartment}>
                                Add Department
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
                    Are you sure you want to delete this department?
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

export default Department;
