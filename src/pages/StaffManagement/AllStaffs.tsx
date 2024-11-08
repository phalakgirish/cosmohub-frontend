import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface Staff {
    _id: string;
    staff_name: string;
    staff_mobile_number: string;
    staff_emailId: string;
    staff_department: string;
    staff_designation: string;
    staff_branch: string;
    staff_status: boolean;
}

interface DataResponse {
    staff: Staff[];
}

const AllStaffs = () => {
    const [data, setData] = useState<Staff[]>([]);
    const [isRefreshed,setIsRefreshed] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-staff/${id}`);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedStaffId(id);
        setShowModal(true);
    };

    // Set page title
    usePageTitle({
        title: 'Staff Members',
        breadCrumbItems: [
            {
                path: '/staffs',
                label: 'Staff Members',
                active: true,
            },
        ],
    });

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/staff/`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data: DataResponse) => {
                const formattedData = data.staff.map((staff, index) => ({
                    srNo: index + 1,
                    ...staff,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error('Error fetching staff data:', error));
    }, [isRefreshed]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddStaff = () => {
        navigate('/add-staff');
    };

    const handleDeleteConfirm = async () => {
        if (selectedStaffId) {
            
            const bearerToken = secureLocalStorage.getItem('login');
            try{
                fetch(`${url.nodeapipath}/staff/${selectedStaffId}`, {
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
                        // setData(data.filter(sip => sip._id !== id)); // Remove deleted SIP from state
                        // console.log('SIP deleted successfully:', result);
                        toast.success(data.message || 'Staff deleted successfully');
                        setIsRefreshed(true)  
                    } else {
                        // console.error('Error deleting SIP:', result);
                        toast.error('Failed to delete Staff');
                        }
                    
                })
                .catch((error) => {
                    // console.error('Error deleting Staff data:', error);
                    toast.error('An error occurred while deleting the staff');

                });
            }
            catch(error)
            {
                toast.error('An error occurred while deleting the staff');

            }finally{
                setShowModal(false);
                setSelectedStaffId(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowModal(false);
        setSelectedStaffId(null);
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Staff Id',
            accessor: 'staff_id',
            sort: true,
        },
        {
            Header: 'Name',
            accessor: 'staff_name',
            sort: true,
        },
        {
            Header: 'Mobile Number',
            accessor: 'staff_mobile_number',
            sort: true,
        },
        {
            Header: 'Email ID',
            accessor: 'staff_emailId',
            sort: true,
        },
        {
            Header: 'Branch',
            accessor: 'staff_branch',
            sort: true,
        },
        {
            Header: 'Department',
            accessor: 'staff_department',
            sort: true,
        },
        {
            Header: 'Designation',
            accessor: 'staff_designation',
            sort: true,
        },
        // {
        //     Header: 'Status',
        //     accessor: 'staff_status',
        //     sort: true,
        //     Cell: ({ value }: { value: boolean }) => (value ? 'Active' : 'Inactive'),
        // },
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
                onClick={() => handleDeleteClick(row.original._id)}
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

    usePageTitle({
        title: 'All Staffs',
        breadCrumbItems: [
            {
                path: '/forms/validation',
                label: 'Forms',
            },
            {
                path: '/forms/validation',
                label: 'Validation',
                active: true,
            },
        ],
    });

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All Staff</h4>
                                <p className="text-muted font-14 mb-4">A table showing all staff members</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddStaff}>
                                Add Staff
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

            <Modal show={showModal} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this staff?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default AllStaffs;
