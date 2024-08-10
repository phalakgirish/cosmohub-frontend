import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// hooks
import { usePageTitle } from '../../../hooks';
import url from '../../../env';

// component
import Table from '../../../components/Table';
import secureLocalStorage from 'react-secure-storage';

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
    const navigate = useNavigate();

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-staff/${id}`);
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
                console.log(data);
                const formattedData = data.staff.map((staff, index) => ({
                    srNo: index + 1,
                    ...staff,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error('Error fetching staff data:', error));
    }, []);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddStaff = () => {
        navigate('/add-staff');
    };

    const handleDelete = (id:any)=>{

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
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Staff Members</h4>
                                <p className="text-muted font-14 mb-4">A table showing all registered staff members</p>
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
        </Row>
    );
};

export default AllStaffs;
