import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';

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
    const navigate = useNavigate();

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-branch/${id}`);
    };

    const handleDelete = async (id:string) =>{
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/branch/${id}`,{
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error('Error fetching branch data:', error));
    }

    // Set page title
    usePageTitle({
        title: 'Branches',
        breadCrumbItems: [
            {
                path: '/branches',
                label: 'Branches',
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
    }, []);

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
        {
            Header: 'Email ID',
            accessor: 'branch_emailId',
            sort: true,
        },
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

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Branches</h4>
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
        </Row>
    );
};

export default Branch;
